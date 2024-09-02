import mongoose from 'mongoose';
import app from './app';
import config from './app/config';

async function main() {
  try {
    await mongoose.connect(config.db_url as string);

    app.listen(config.port, () => {
      console.log(
        `Meeting Room Booking System for Co-working spaces app listening on port ${config.port}`,
      );
    });
  } catch (error) {
    console.log(error);
  }
}

main();
