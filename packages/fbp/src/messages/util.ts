/**
 * Strips the message secret from the message type.
 */
export type ServerMessage<T> = Omit<T, 'secret'>;