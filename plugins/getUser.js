const getUser = async (userId, token) => {
  const user = await fetch(`https://discord.com/api/v10/users/${userId}`, {
    headers: {
      Authorization: `Bot ${process.env.token}`
    },
  }).then(res => res.json());

  return user
}

module.exports = {
  getUser
}