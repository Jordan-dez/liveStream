import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { User, Concert, Purchase, StreamToken } from '../types';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment
const USERS_TABLE = process.env.USERS_TABLE || 'Users';
const CONCERTS_TABLE = process.env.CONCERTS_TABLE || 'Concerts';
const PURCHASES_TABLE = process.env.PURCHASES_TABLE || 'Purchases';
const STREAM_TOKENS_TABLE = process.env.STREAM_TOKENS_TABLE || 'StreamTokens';

// Users
export const getUserById = async (userId: string): Promise<User | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { userId },
    })
  );
  return result.Item as User | null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  // Note: Pour MVP, on fait un scan. Pour production, créer un GSI sur email
  const result = await docClient.send(
    new ScanCommand({
      TableName: USERS_TABLE,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email },
      Limit: 1,
    })
  );
  return result.Items?.[0] as User | null;
};

export const createUser = async (user: User): Promise<void> => {
  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    })
  );
};

// Concerts
export const getConcertById = async (concertId: string): Promise<Concert | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: CONCERTS_TABLE,
      Key: { concertId },
    })
  );
  return result.Item as Concert | null;
};

export const listConcerts = async (status?: string): Promise<Concert[]> => {
  if (status) {
    // Utiliser le GSI status-date-index
    const result = await docClient.send(
      new QueryCommand({
        TableName: CONCERTS_TABLE,
        IndexName: 'status-date-index',
        KeyConditionExpression: '#status = :status',
        ExpressionAttributeNames: { '#status': 'status' },
        ExpressionAttributeValues: { ':status': status },
      })
    );
    return (result.Items || []) as Concert[];
  }
  
  // Scan pour tous les concerts (pour MVP)
  const result = await docClient.send(
    new ScanCommand({
      TableName: CONCERTS_TABLE,
    })
  );
  return (result.Items || []) as Concert[];
};

export const createConcert = async (concert: Concert): Promise<void> => {
  await docClient.send(
    new PutCommand({
      TableName: CONCERTS_TABLE,
      Item: concert,
    })
  );
};

// Purchases
export const getPurchase = async (purchaseId: string): Promise<Purchase | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: PURCHASES_TABLE,
      Key: { purchaseId },
    })
  );
  return result.Item as Purchase | null;
};

export const getPurchaseByUserAndConcert = async (
  userId: string,
  concertId: string
): Promise<Purchase | null> => {
  const result = await docClient.send(
    new QueryCommand({
      TableName: PURCHASES_TABLE,
      IndexName: 'user-concerts-index',
      KeyConditionExpression: 'userId = :userId',
      FilterExpression: 'concertId = :concertId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':concertId': concertId,
      },
      Limit: 1,
    })
  );
  return result.Items?.[0] as Purchase | null;
};

export const createPurchase = async (purchase: Purchase): Promise<void> => {
  await docClient.send(
    new PutCommand({
      TableName: PURCHASES_TABLE,
      Item: purchase,
    })
  );
};

export const updatePurchaseStatus = async (
  purchaseId: string,
  status: 'pending' | 'completed' | 'failed'
): Promise<void> => {
  await docClient.send(
    new PutCommand({
      TableName: PURCHASES_TABLE,
      Item: {
        purchaseId,
        status,
      },
    })
  );
};

// StreamTokens
export const getStreamToken = async (tokenId: string): Promise<StreamToken | null> => {
  const result = await docClient.send(
    new GetCommand({
      TableName: STREAM_TOKENS_TABLE,
      Key: { tokenId },
    })
  );
  return result.Item as StreamToken | null;
};

export const createStreamToken = async (streamToken: StreamToken): Promise<void> => {
  await docClient.send(
    new PutCommand({
      TableName: STREAM_TOKENS_TABLE,
      Item: streamToken,
    })
  );
};

export const deleteStreamToken = async (tokenId: string): Promise<void> => {
  await docClient.send(
    new DeleteCommand({
      TableName: STREAM_TOKENS_TABLE,
      Key: { tokenId },
    })
  );
};

