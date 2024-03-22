import { PubSub } from '@google-cloud/pubsub'
import env from './env'
import logger from './logger'
import { Ok, Result } from '../utils/result'
import { DefaultError } from '../utils/errors'

/**
 * An interface for a publisher that publishes messages to a message broker.
 */
export interface IPublisher {
  /**
   * Publishes the given data to the given topic.
   * @param data The data to publish.
   * @param topicNameOrId The name or id of the topic to publish to. If not provided, defaults to the PUBSUB_TOPIC environment variable.
   */
  publish<T>(data: T, topicNameOrId?: string | undefined): Promise<Result<string, Error>>
}

/**
 * A publisher that publishes messages to Google Cloud Pub/Sub.
 */
class GoogleCloudPublisher implements IPublisher {
  private readonly pubSubClient: PubSub

  constructor() {
    this.pubSubClient = new PubSub()
  }

  /**
   * Publishes the given data to the given topic.
   * @param data The data to publish.
   * @param topicNameOrId The name or id of the topic to publish to. If not provided, defaults to the PUBSUB_TOPIC environment variable.
   */
  async publish<T>(data: T, topicNameOrId?: string | undefined): Promise<Result<string, Error>> {
    const topic = topicNameOrId || env.getOrDefault('PUBSUB_TOPIC', '')
    const dataBuffer = Buffer.from(JSON.stringify(data))
    try {
      logger.info('Publishing message to topic: ', topic)
      const messageId = await this.pubSubClient.topic(topic).publishMessage({ data: dataBuffer })
      logger.info(`Message ${messageId} published.`)
      return Ok(messageId)
    } catch (error) {
      logger.error(`Received error while publishing: ${error.message}`)
      return new DefaultError(error)
    }
  }
}

class MockPublisher implements IPublisher {
  async publish<T>(data: T, topicNameOrId?: string | undefined): Promise<Result<string, Error>> {
    const isSuccess = typeof data === 'boolean' ? data : true
    topicNameOrId ??= 'mock-topic'
    return isSuccess ? Ok(topicNameOrId) : new DefaultError(new Error('Failed to publish message'))
  }
}

let publisher: IPublisher
export const publisherFactory = {
  get: (): IPublisher => {
    if (publisher) return publisher
    if (env.isTest()) {
      publisher = new MockPublisher()
    } else {
      publisher = new GoogleCloudPublisher()
    }
    return publisher
  }
}
