import {MarkdownView, Plugin,TFile } from 'obsidian';

export default class AutomaticLinks extends Plugin {

	async onload() {

		this.addRibbonIcon("link-glyph", "Internal Links", async () => {
			const noteFile = this.app.workspace.getActiveFile(); // Currently Open Note
			if(!noteFile.name) return; // Nothing Open
			await this.extractReferenceFile(noteFile);
		});
	
	}

	onunload() {
	}

	//To Read the filenames under same level
	async extractReferenceFile(activeFile: TFile) {
		
		let newFile=activeFile.path.toString()
		let primaryDirectory = newFile.replace(/([?!\/].*)/gm,""); //First Directory is selected
		let referenceFile: String;

		primaryDirectory=primaryDirectory+"/Internal Link.md"; //Internal Link(Reference) file is appened to path 

		const fileContents = await Promise.all(this.app.vault.getMarkdownFiles().map((file) => { return file}  ));

		for (var i=0; i<fileContents.length; i++) {
			if (primaryDirectory==fileContents[i].path.toString()) {
				referenceFile=await this.app.vault.cachedRead(fileContents[i]);
			}
		}

		this.extractInternalLink(referenceFile);
	}


	//Generate md link for filenames under same path
	extractInternalLink(referenceFile: String)  {

		const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
		let selectedText=editor.getSelection();
		let mdinternallink: String;
		var regex = new RegExp("\\[("+selectedText+")\\]","ig");

		if(regex.test(referenceFile.toString())) {
			let referenceContent = new Array();
			var lineRegex=new RegExp("\\[("+selectedText+")\\].*","ig");

			referenceContent=referenceFile.split(",");
			
			for (var i=0; i<referenceContent.length; i++) {
				if (lineRegex.test(referenceContent[i])){
					mdinternallink=referenceContent[i].toString();
				}
			}
		}

		editor.replaceSelection(mdinternallink.toString(),selectedText);
	}
}
