const fs = require('node:fs');

const ItemType = {
    FILE: 0,
    DIRECTORY: 1,
    SYMLINK: 2,
    UNKNOWN: 3
}

/*
dõi một thư mục (và có thể cả các thư mục con) để phát hiện các thay đổi như thêm, xóa, hoặc chỉnh sửa tệp. Nó sử dụng fs.watch() của Node.js để theo dõi sự kiện trong hệ thống tệp.
Tự động phát hiện các thay đổi trong thư mục và thực hiện hành động tương ứng.
Bạn có thể dùng để theo dõi một thư mục chứa các plugin, tệp JSON, hoặc các tệp khác và tự động cập nhật chúng vào bot của bạn
*/

module.exports = class FolderWatcher {

	constructor (folder, recursive = true) {

		this.watchers = new Map();

		this.folder = folder;
		this.recursive = recursive;

		this.onAdd    = null;
		this.onRemove = null;
		this.onChange = null;

		this.addWatcher(folder);
	}

	Destroy () {
		for (const watcher of this.watchers.values()) {
			watcher.close();
		}
		this.onAdd = null;
		this.onRemove = null;
		this.onChange = null;
		this.watchers.clear();
	}

	GetItemType(file) {
		try {
			const stats = fs.lstatSync(file);
			if (stats.isFile()) return ItemType.FILE;
			if (stats.isDirectory()) return ItemType.DIRECTORY;
			if (stats.isSymbolicLink()) return ItemType.SYMLINK;
		} catch (err) {
			console.error(`Lỗi nhận loại mục cho tệp: ${file}`);
			console.error(err);
		}
		return ItemType.UNKNOWN;
	}
	

	Add (file) {

		if (this.recursive && fs.lstatSync(file).isDirectory()) {
			this.addWatcher(file);
		}

		if (this.onAdd) this.onAdd(file, this.GetItemType(file));
	}

	Remove (file) {

		for (const [path, watcher] of this.watchers) {
			if (path.startsWith(file)) {
				watcher.close();
				this.watchers.delete(path);
			}
		}

		if (this.onRemove) this.onRemove(file);
	}

	Change (file) {
		if (this.onChange) this.onChange(file);
	}

	WatcherEvent(path, event, filename) {

		if (!filename) {
			console.warn(`Tên tệp là null cho đường dẫn: ${path}`);
			return;
		}
	
		const fullPath = `${path}/${filename}`;
		if (event === 'change') {
			this.Change(fullPath);
		} else if (event === 'rename') {
			if (fs.existsSync(fullPath)) {
				this.Add(fullPath);
			} else {
				this.Remove(fullPath);
			}
		}
	}
	

	addWatcher (path) {
		if (this.watchers.has(path)) return;
		const watcher = fs.watch(path, this.WatcherEvent.bind(this, path));
		this.watchers.set(path, watcher);

		if (!this.recursive) return;

		const stats = fs.lstatSync(path);
		if (stats.isDirectory()) {
			const items = fs.readdirSync(path, { withFileTypes: true });
			for (const item of items) {
				if (item.isDirectory()) {
					this.addWatcher(`${path}/${item.name}`);
				}
			}
		}
	}
}