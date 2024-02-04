import User from '../../src/models/user.model'

export const createOrUpdateTestUser = async (username?: string, password?: string) => {
  username ??= 'test@test.com'
  password ??= '$2a$10$RVHD7EksNzceEezVsMFlCeaa5PYJKGkkiqkQbnC/ezjTIAymuLwui'
  let user = await User.findOne({ where: { username } })
  if (user) {
    user.first_name = 'TJ'
    user.last_name = 'M'
  } else {
    user = User.build({
      first_name: 'TJ',
      last_name: 'M',
      username: 'test@test.com',
      password: password
    })
  }
  return await user.save()
}
