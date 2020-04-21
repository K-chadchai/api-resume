const _ProjectName = 'media';
export const _AppName = `${_ProjectName}-micro`;

// Mongo
export const _MongoConn =
  'mongodb+srv://dohome:dohome@cluster0-ls47k.mongodb.net/test?retryWrites=true&w=majority';

// Table List
export const _MongoTables = {
  users: 't-users',
};

// Kafka
export const _KafkaBrokers = ['localhost:9092'];

// MessagePattern
export const _KafkaMessage = {
  picture_getPicture: `${_ProjectName}.picture.getPicture`,
  users_createUser: `${_ProjectName}.users.createUser`,
  users_getUsersAll: `${_ProjectName}.users.getUsersAll`,
  users_updateUser: `${_ProjectName}.users.updateUser`,
};
