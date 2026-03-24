import 'dotenv/config';
import './sentry.js';
import app from './app.js';
import logger from './lib/logger.js';

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
