import { WeekNum } from '@/constants/weekEnum';
import { ModelsEnum, PickModelType } from '@/models';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { nanoid } from 'nanoid';
import { Op } from 'sequelize';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  @Timeout(1000)
  async handleCron() {
    // 轮询函数
  }

  // 添加轮询
  async addTimingTask(name: string, rule: string) {
    this.logger.debug(`开启轮询 ${name}----（${rule}）`);
    const job = new CronJob(rule, async () => {
      // 创建任务
      await this.addTimeout(name, 1);

      this.logger.warn(`工作中 ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // 设置定时
  async addTimeout(name: string, seconds: number) {
    this.logger.debug(`开启任务 --- 定时器 ${name}`);

    const callback = async () => {
      this.logger.warn(`任务结束 ${name}`);
    };

    const timeout = setTimeout(callback, seconds * 1000);
    this.schedulerRegistry.addTimeout(name, timeout);
  }

  // 创建单次的任务
  async singTaskCorn(name: string, date: Date) {
    this.logger.debug(
      `启动 单次任务 ${name}----（${dayjs(date).format('YYYY-MM-DD hh:mm')}）`,
    );
    const job = new CronJob(date, async () => {
      // 任务逻辑
    });
    this.schedulerRegistry.addCronJob(name, job);
    job.start();
  }

  // 删除任务
  deleteCron(name: string) {
    this.logger.warn(`任务 ${name} 终止!`);
    if (this.schedulerRegistry.doesExist('cron', name)) {
      this.schedulerRegistry.deleteCronJob(name);
    }
  }

  // 单次的任务
  async schduleTaskCorn(name: string, date: Date) {
    this.logger.debug(
      `启动 任务 ${name}----（${dayjs(date).format('YYYY-MM-DD hh:mm')}）`,
    );
    const job = new CronJob(date, async () => {
      // 任务逻辑
    });
    job.start();
  }
}
