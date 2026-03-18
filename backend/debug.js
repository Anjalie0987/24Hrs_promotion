const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./dist/app.module');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    await app.listen(3002);
    console.log("App started");
    process.exit(0);
  } catch (e) {
    console.error("BOOTSTRAP ERROR:");
    console.error(e);
    process.exit(1);
  }
}
bootstrap();
