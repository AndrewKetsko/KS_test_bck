import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class HealthService {
  @Cron('0 */14 * * * *')
  async health_check(): Promise<void> {
    try {
      const res = await fetch(process.env.SERVER_URL + '/health');
      console.log(await res.json());
    } catch (error) {}
  }
}
