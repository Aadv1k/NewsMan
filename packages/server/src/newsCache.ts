import * as NewsMan from "@newsman/core";

const cache = new NewsMan.LocalCache(1.8e+7); // 5 hours

export default cache;
