import { IPublisher } from '../../src/config/publisher'
import User from '../../src/models/user.model'
import { DefaultError } from '../../src/utils/errors'
import { Ok, Result } from '../../src/utils/result'

class IntegrationTestPublisher implements IPublisher {
  async publish<T>(data: T, topicNameOrId?: string | undefined): Promise<Result<string, Error>> {
    if (typeof data !== 'object') {
      return new DefaultError(new Error('Failed to publish message'))
    }

    const message = data as { userId: string }
    topicNameOrId ??= 'mock-topic'

    const user = await User.findByPk(message.userId)
    if (!user) return new DefaultError(new Error('User not found'))

    user.email_verification_token = message.userId
    user.email_verification_sent_date = new Date()
    await user.save()

    return Ok('Message published')
  }
}

const integrationTestPublisher = new IntegrationTestPublisher()
export default integrationTestPublisher
