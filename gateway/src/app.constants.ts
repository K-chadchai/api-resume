const _ProjectName = 'media';
export const _AppName = `${_ProjectName}-gateway`;

// Kafka
export const _KafkaBrokers = ['localhost:9092'];
export const _KafkaModule = {
  picture: `${_AppName}.picture`,
  users: `${_AppName}.users`,
};

// MessagePattern
export const _KafkaMessage = {
  picture_getPicture: `${_ProjectName}.picture.getPicture`,
  users_createUser: `${_ProjectName}.users.createUser`,
  users_getUsersAll: `${_ProjectName}.users.getUsersAll`,
  users_updateUser: `${_ProjectName}.users.updateUser`,
};
