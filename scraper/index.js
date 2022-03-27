import fetch from 'node-fetch'
import fs from 'fs'

function chunk(arr, n) {
  const res = []
  for (let i = 0; i < arr.length; i += n) {
    res.push(arr.slice(i, i + n))
  }
  return res
}

async function getJson(url) {
  const res = await fetch(url)
  return res.json()
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

async function main() {
  const usersList = (await getJson("https://curius.app/api/users/all")).users

  // turn users into an object
  const users = usersList.reduce((accum, cur) => {
    accum[cur.id] = cur
    return accum
  }, {})

  // enrich users by adding in profile info
  // do this 50 at a time
  const chunks = chunk(usersList, 10)
  for (const chunk of chunks) {
    await chunk.map(async user => {
      const profile = (await getJson(`https://curius.app/api/users/${user.userLink}`)).user
      console.log(`fetched response for ${user.userLink}`)
      const usefulparts = {
        created_date: profile.createdDate,
        last_online: profile.lastOnline,
        views: profile.views,
        num_followers: profile.numFollowers,
        following_users: profile.followingUsers.map(u => u.id),
      }

      // fetch links
      let hasLinksToFetch = true
      let page = 0
      const links = []
      while (hasLinksToFetch) {
        const fetchedLinks = (await getJson(`https://curius.app/api/users/${profile.id}/links?page=${page}`)).userSaved
        hasLinksToFetch = links.length > 0
        links.push(...fetchedLinks.map(l => ({
          link_id: l. id,
          link: l.link,
          title: l.title,
          created_by: l.createdBy,
          created_date: l.createdDate,
          mentions: l.mentions.map(m => ({
            to: m.to.id,
            from: m.from.id
          })),
          n_highlights: l.highlights.length,
        })))
        page++
      }
      users[profile.id] = {
        ...users[profile.id],
        ...usefulparts,
        links,
      } 
    })
    await sleep(500)
  }
  fs.writeFileSync('./dump.json', JSON.stringify({
    users,
  }, null, 2))
}

main()