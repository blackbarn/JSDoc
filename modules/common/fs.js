/**
	@overview File system stuff.
	@author Michael Mathews <micmath@gmail.com>
	@license Apache License 2.0 - See file 'LICENSE.markdown' in this project.
 */

/**
	@desc Functionality related to the filesystem.
	@namespace fs
 */
var fs = (typeof exports === 'undefined')? {} : exports; // like commonjs

(function() {
	var slash = java.lang.System.getProperty('file.separator') || '/',
		File = Packages.java.io.File,
		defaultEncoding = 'utf-8';
	
	fs.read = function(path, options) {
		var options = options || {},
			encoding = options.encoding || defaultEncoding;
		
		return readFile(path, encoding);
	}
	
	fs.write = function(path, content, options) {
		var options = options || {},
			encoding = options.encoding || defaultEncoding,
			out;
		
		out = new Packages.java.io.PrintWriter(
			new Packages.java.io.OutputStreamWriter(
				new Packages.java.io.FileOutputStream(path),
				encoding
			)
		);
		
		out.write(content);
		out.flush();
		out.close();
	}
	
	/**
	 * Check if a file exists.
	 * @param {string} path The file to check.
	 * @returns {boolean}
	 */
	fs.exists = function(path) {
		var file = new File(path);
	
		if (file.isDirectory()){
			return true;
		}
		if (!file.exists()){
			return false;
		}
		if (!file.canRead()){
			return false;
		}
		return true;
	}
	
	/**
	 * Get a list of all files in a given directory. Will not include files that
	 * start with a dot.
	 * @type string[]
	 * @param {string} dir The starting directory to look in.
	 * @param {number} [recurse=1] How many levels deep to scan.
	 * @returns {string[]} An array of {string} paths to the files in the given directory.
	 */
	fs.ls = function(dir, recurse, _allFiles, _path) {
		var files,
			file;
	
		if (typeof _path === 'undefined') { // initially
			_allFiles = [];
			_path = [dir];
		}
		
		if (_path.length === 0) { return _allFiles; }
		if (typeof recurse === 'undefined') { recurse = 1; }
		
		dir = new File(dir);
		if (!dir.directory) { return [String(dir)]; }
		files = dir.list();
		
		for (var f = 0, lenf = files.length; f < lenf; f++) {
			file = String(files[f]);
		
			if (file.match(/^\.[^\.\/\\]/)) { continue; } // skip dot files
	
			if ((new File(_path.join(slash) + slash + file)).list()) { // it's a directory
				_path.push(file);
				
				if (_path.length - 1 < recurse) {
					fs.ls(_path.join(slash), recurse, _allFiles, _path);
				}
				_path.pop();
			}
			else { // it's a file	
				_allFiles.push(
					fixSlash( (_path.join(slash) + slash + file) )
				);
			}
		}
	
		return _allFiles;
	}
	
	// fix multiple slashes, like one//two
	function fixSlash(path) {
		return path.replace(/[\/\\]+/g, slash);
	}

})();

