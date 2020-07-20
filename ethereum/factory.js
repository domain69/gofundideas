import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface), '0xeB5C130D91D251292F94D58c968Cf74332b28141');

export default instance;