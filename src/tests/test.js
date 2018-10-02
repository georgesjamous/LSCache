import {
	LSCache
} from "../index";
var Storage = require("node-localstorage").LocalStorage;
// localStorage = new LocalStorage("./scratch");

const printste = (cache) => {
	for (var i = 0; i < cache.storage.length; i++) {
		console.log(cache.storage.key(i), cache.storage.getItem(cache.storage.key(i)));
	}
};

class SSS extends Storage {

}
const ss = new SSS("./scratch.js");

const cache = new LSCache({
	storage: ss
});
cache.setBatch({
	key1: "val1",
	key2: "val1",
	key3: "val1",
	key4: "val1",
	key5: "val1",
	key6: "val1"
});
// cache.set("key1", "value1");
// cache.set("key2", "value1");
// cache.set("key3", "value2");
// cache.set("key4", "value3");
// cache.set("key4", {
// 	a: "a",
// 	b: 1,
// 	c: 1.23,
// 	d: {
// 		a: 1
// 	}
// });
// cache.set("key5", "value3");
// cache.set("key6", "value3");
// cache.set("key7", "value3");
setTimeout(() => {
	printste(cache);
}, 3000);
printste(cache);