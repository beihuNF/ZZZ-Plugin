import _ from 'lodash';
import { getMapData } from '../../utils/file.js';
import { calculate_damage } from './role.js';
import { ZZZAvatarInfo } from '../avatar.js';
const skilldict = getMapData('SkillData');
/**
 * 角色加成
 * @param {ZZZAvatarInfo} data 角色信息
 * @param {ZZZAvatarInfo['damage_basic_properties']['base_detail']} base_detail 基础属性
 * @param {ZZZAvatarInfo['damage_basic_properties']['bonus_detail']} bonus_detail 套装加成
 * @returns {{
 * title: string,
 * value: {name: string, value: number}[]
 * }[]} 伤害列表
 */
export const avatar_ability = (data, base_detail, bonus_detail) => {
  const damagelist = [];
  switch (data.id) {
    case 1191:
      /** 处理命座加成 */
      if (data.rank >= 1) {
        const CriticalChanceBase = _.get(bonus_detail, 'CriticalChanceBase', 0);
        bonus_detail['CriticalChanceBase'] = CriticalChanceBase + 0.12;
      }
      if (data.rank >= 2) {
        const ES_CriticalDamageBase = _.get(
          bonus_detail,
          'ES_CriticalDamageBase',
          0
        );
        bonus_detail['ES_CriticalDamageBase'] = ES_CriticalDamageBase + 0.6;
        const EH_CriticalDamageBase = _.get(
          bonus_detail,
          'EH_CriticalDamageBase',
          0
        );
        bonus_detail['EH_CriticalDamageBase'] = EH_CriticalDamageBase + 0.6;
      }
      if (data.rank >= 6) {
        const PenRatio = _.get(bonus_detail, 'PenRatioBase', 0);
        bonus_detail['PenRatioBase'] = PenRatio + 0.2;

        const C_DmgAdd = _.get(bonus_detail, 'C_DmgAdd', 0);
        bonus_detail['C_DmgAdd'] = C_DmgAdd + 2.5;
      }

      /** 处理天赋加成 */
      /** 获取天赋等级与加成倍率 */
      const CDB = getskilllevelnum(data.id, data.skills, 'T', 'T');
      const C_CriticalDamageBase = _.get(
        bonus_detail,
        'C_CriticalDamageBase',
        0
      );
      bonus_detail['C_CriticalDamageBase'] = C_CriticalDamageBase + CDB;
      const A_CriticalDamageBase = _.get(
        bonus_detail,
        'A_CriticalDamageBase',
        0
      );
      bonus_detail['A_CriticalDamageBase'] = A_CriticalDamageBase + CDB;

      const IceDmgAdd = _.get(bonus_detail, 'Ice_DmgAdd', 0);
      bonus_detail['Ice_DmgAdd'] = IceDmgAdd + 0.3;

      /** 计算伤害 */
      /** 计算普攻伤害 */
      const skill_multiplier1 = getskilllevelnum(
        data.id,
        data.skills,
        'A',
        'A'
      );
      const damagelist1 = calculate_damage(
        base_detail,
        bonus_detail,
        'A',
        'A',
        'Ice',
        skill_multiplier1,
        data.level
      );
      const damage1 = {
        title: '普通攻击：急冻修剪法',
        value: damagelist1,
      };
      damagelist.push(damage1);

      /** 计算冲刺伤害 */
      const skill_multiplier2 = getskilllevelnum(
        data.id,
        data.skills,
        'C',
        'C'
      );
      const damagelist2 = calculate_damage(
        base_detail,
        bonus_detail,
        'C',
        'C',
        'Ice',
        skill_multiplier2,
        data.level
      );
      const damage2 = {
        title: '冲刺攻击：冰渊潜袭',
        value: damagelist2,
      };
      damagelist.push(damage2);

      /** 计算特殊技伤害 */
      const skill_multiplier3 = getskilllevelnum(
        data.id,
        data.skills,
        'E',
        'EH'
      );
      const damagelist3 = calculate_damage(
        base_detail,
        bonus_detail,
        'E',
        'EH',
        'Ice',
        skill_multiplier3,
        data.level
      );
      const damage3 = {
        title: '强化特殊技：横扫',
        value: damagelist3,
      };
      damagelist.push(damage3);

      const skill_multiplier4 = getskilllevelnum(
        data.id,
        data.skills,
        'E',
        'ES'
      );
      const damagelist4 = calculate_damage(
        base_detail,
        bonus_detail,
        'E',
        'ES',
        'Ice',
        skill_multiplier4,
        data.level
      );
      const damage4 = {
        title: '强化特殊技：鲨卷风',
        value: damagelist4,
      };
      damagelist.push(damage4);

      /** 计算连携技伤害 */
      const skill_multiplier5 = getskilllevelnum(
        data.id,
        data.skills,
        'R',
        'RL'
      );
      const damagelist5 = calculate_damage(
        base_detail,
        bonus_detail,
        'RL',
        'RL',
        'Ice',
        skill_multiplier5,
        data.level
      );
      const damage5 = {
        title: '连携技：雪崩',
        value: damagelist5,
      };
      damagelist.push(damage5);

      /** 计算终结技伤害 */
      const skill_multiplier6 = getskilllevelnum(
        data.id,
        data.skills,
        'R',
        'R'
      );
      const damagelist6 = calculate_damage(
        base_detail,
        bonus_detail,
        'R',
        'R',
        'Ice',
        skill_multiplier6,
        data.level
      );
      const damage6 = {
        title: '终结技：永冬狂宴',
        value: damagelist6,
      };
      damagelist.push(damage6);

      logger.debug('伤害', damagelist);
      break;
  }

  return damagelist;
};

export const getskilllevelnum = (avatarId, skills, skilltype, skillname) => {
  let skill_typeid = 0;
  if (skilltype == 'A') skill_typeid = 0;
  else if (skilltype == 'C') skill_typeid = 2;
  else if (skilltype == 'E') skill_typeid = 1;
  else if (skilltype == 'R') skill_typeid = 3;
  else if (skilltype == 'L') skill_typeid = 6;
  else if (skilltype == 'T') skill_typeid = 5;
  let skilllevel =
    Number(
      skills.find(property => property.skill_type === skill_typeid)?.level || 1
    ) - 1;
  return skilldict[avatarId][skillname][skilllevel];
};
