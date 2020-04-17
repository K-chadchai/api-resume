const _ProjectName = 'media';
export const _AppName = `api-${_ProjectName}`;

// Kafka
export const _KafkaBrokers = ['localhost:9092'];
export const _KafkaModule = {
  picture: `${_AppName}.picture`,
};
export const _KafkaMessage = {
  picture_getPicture: `${_ProjectName}.picture.getPicture`,
};
