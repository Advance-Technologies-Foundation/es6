const path = require('path');
const fs = require('fs');
const toposort = require('toposort')

class Modules {
	constructor(corePath, coreModulesObjectPath) {
		this.corePath = corePath;
		this.coreModulesObjectPath = coreModulesObjectPath;
		const modulesPath = `${corePath}${coreModulesObjectPath}`;
		const modulesString = fs.readFileSync(modulesPath).toString();
		this.coreModules = JSON.parse(modulesString.replace(/coreModules\s=\s|;/gi, ''));
	}

	isSeparatedFromBuild(module) {
		return this.coreModules[module].separateFromBuild;
	}

	filterNotExistingFiles(files) {
		return files.filter(file => fs.existsSync(file));
	}

	resolveModulePath(module, fileName, typeSuffix) {
		return path.resolve(`${this.corePath}/${module.path}/${fileName}.${typeSuffix}`);
	}

	getStyleModules(type) {
		const filesList = [];
		Object.values(this.coreModules)
			.filter(module => module[type] && module[type].length)
			.forEach(module => {
				module[type].forEach(file => {
					const filePath = this.resolveModulePath(module, file, type);
					if (filesList.includes(filePath)) {
						return;
					}
					filesList.push(filePath);
				});
			});
		return this.filterNotExistingFiles(filesList);
	}

	getJsModules() {
		const graph = [];
		const coreModules = this.coreModules;
		for(let module in coreModules) {
			if (!this.isSeparatedFromBuild(module) && coreModules[module].deps) {
				coreModules[module].deps.forEach(dep => {
					if (!this.isSeparatedFromBuild(dep)) {
						graph.push([dep, module]);
					}
				});
			}
		}
		let jsModules = toposort(graph);
		jsModules = jsModules.map(moduleName => {
			const module = coreModules[moduleName];
			const fileName = module.file || moduleName;
			return this.resolveModulePath(module, fileName, "js");
		});
		return this.filterNotExistingFiles(jsModules);
	}

	getLessModules() {
		return this.getStyleModules("less");
	}

	getCssModules() {
		return this.getStyleModules("css");
	}
}



module.exports = (corePath, coreModulesObjectPath) => {
	const modules = new Modules(corePath, coreModulesObjectPath);

	modules.lessModules = modules.getLessModules();
	modules.cssModules = modules.getCssModules();
	modules.jsModules = modules.getJsModules();
	return modules;
};
