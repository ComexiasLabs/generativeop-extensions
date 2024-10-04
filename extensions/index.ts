import aptosscan from './aptos-scan';
import blockfabric from './blockfabric';
import github from './github';
import markdown from './markdown';
import nocommentary from './no-commentary';
import troncontracts from './tron-contracts';
import tronscan from './tron-scan';

const extensions = [markdown, tronscan, aptosscan, nocommentary, blockfabric, github, troncontracts];

export default extensions;
