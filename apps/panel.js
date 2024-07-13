import { ZZZPlugin } from '../lib/plugin.js';
import render from '../lib/render.js';
import { rulePrefix } from '../lib/common.js';
import { getPanelList, refreshPanel, getPanel } from '../lib/avatar.js';

export class Panel extends ZZZPlugin {
  constructor() {
    super({
      name: '[ZZZ-Plugin]Panel',
      dsc: 'zzzpanel',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: `${rulePrefix}((刷新|更新)面板|面板(刷新|更新))$`,
          fnc: 'refreshPanel',
        },
        {
          reg: `${rulePrefix}面板(列表)?$`,
          fnc: 'getCharPanelList',
        },
        {
          reg: `${rulePrefix}(.+)面板$`,
          fnc: 'getCharPanel',
        },
      ],
    });
  }
  async refreshPanel() {
    const { api, deviceFp, uid } = await this.getAPI();
    if (!api || !uid) return false;
    await this.getPlayerInfo();
    const result = await refreshPanel(this.e, api, uid, deviceFp);
    const newChar = result.filter(item => item.isNew);
    let str = '面板列表获取成功，本次共刷新了' + newChar.length + '个角色：\n';
    for (const item of result) {
      str += item.name_mi18n + (item.isNew ? '（新）' : '') + '、';
    }
    str = str.slice(0, -1);
    str += '\n总计' + result.length + '个角色';
    await this.reply(str);
    // const finalData = {
    //   list: noteData,
    // };
    // await render(this.e, 'panel/refresh.html', finalData);
  }
  async getCharPanelList() {
    const uid = await this.getUID();
    if (!uid) return false;
    const noteData = getPanelList(uid);
    if (!noteData) return false;
    await this.getPlayerInfo();
    let str = '面板列表获取成功，共计' + noteData.length + '个角色：';
    for (const item of noteData) {
      str += item.name_mi18n + '、';
    }
    str = str.slice(0, -1);
    await this.reply(str);
    // const finalData = {
    //   list: noteData,
    // };
    // await render(this.e, 'panel/list.html', finalData);
  }
  async getCharPanel() {
    const uid = await this.getUID();
    if (!uid) return false;
    const reg = new RegExp(`${rulePrefix}(.+)面板$`);
    const name = this.e.msg.match(reg)[4];
    const data = getPanel(uid, name);
    if (!data) {
      await this.reply(`未找到角色${name}的面板信息`);
      return false;
    }
    await data.get_detail_assets();
    const finalData = {
      charData: data,
    };
    await render(this.e, 'panel/card.html', finalData);
  }
}