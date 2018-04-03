/**
 * Text-label class.
 */
Ext.define("Terrasoft.controls.Label", {
	extend: "Terrasoft.controls.Component",
	alternateClassName: "Terrasoft.Label",

	/**
	 * @inheritdoc Terrasoft.Component#tpl
	 * @override
	 */
	tpl: [
		"<label {inputId} id = {id} class = \"{labelClass}\" style = \"{labelStyle}\" title=\"{hint}\"",
		"<tpl if=\"direction\">dir=\"{direction}\"</tpl>>{caption}",
		"</label>"
	],

	/**
	 * Css-class, prohibits the line break
	 * @private
	 * @type {String}
	 */
	noWordWrapClass: "t-label-nowordwrap",

	/**
	 * Specifies whether break lines on return character.
	 * @property {Boolean}
	 */
	isMultiline: false,

	/**
	 * The base css class for the control
	 * @protected
	 * @type {String}
	 */
	labelClass: "t-label",

	/**
	 * Css-class that indicates the that the control is required
	 * @protected
	 * @type {String}
	 */
	requiredClass: "t-label-is-required",

	/**
	 * Text inside the item
	 * @type {String}
	 */
	caption: "",

	/**
	 * Text or array of text for highlights.
	 * @type {String|String[]}
	 */
	highlightText: "",

	/**
	 * Html tag, which should be used to select a part of the inscription.
	 * @type {String}
	 */
	highlightTag: "b",

	/**
	 * The width of the element, if a number is set, then the width will be calculated in pixels,
	 * if a string is set - then the width will be set according to the specified measurement units.
	 * @type {String / Number}
	 */
	width: "",

	/**
	 * Item font.
	 * @type {String}
	 */
	font: "",

	/**
	 * Line break, true by default (enabled).
	 * @type {Boolean}
	 */
	wordWrap: true,

	/**
	 * Id of the element to which the label is bound.
	 * @type {String}
	 */
	inputId: "",

	/**
	 * Required, false by default (disabled).
	 * @type {Boolean}
	 */
	isRequired: false,

	/**
	 * @inheritdoc Terrasoft.Component#disabledClass
	 * @override
	 */
	disabledClass: "t-label-disabled",

	/**
	 * @inheritdoc Terrasoft.Component#init
	 * @override
	 */
	init: function() {
		this.callParent(arguments);
		this.addEvents(
			/**
			 * @event click
			 * Fires when a click is detected within the element.
			 */
			"click"
		);
		this.updateDirection(this.caption);
	},

	/**
	 * @inheritdoc Terrasoft.Component#getTplData
	 * @override
	 */
	getTplData: function() {
		var tplData = this.callParent(arguments);
		var labelTplData = {
			labelClass: this.getLabelClass(),
			caption: this.getInnerHtml()
		};
		var inputId = this.inputId;
		/*jshint quotmark: false */
		labelTplData.inputId = (inputId) ? "for = \"" + Terrasoft.encodeHtml(inputId) + "\"" : "";
		/*jshint quotmark: true */
		Ext.apply(labelTplData, tplData, {});
		this.styles = Ext.Object.merge(this.styles || {}, this.getStyles());
		this.selectors = this.getSelectors();
		return labelTplData;
	},

	/**
	 * @inheritdoc Terrasoft.Component#getBindConfig
	 * @override
	 */
	getBindConfig: function() {
		var bindConfig = this.callParent(arguments);
		var labelBindConfig = {
			caption: {
				changeMethod: "setCaption"
			},
			isRequired: {
				changeMethod: "setRequired"
			},
			highlightText: {
				changeMethod: "setHighlightText"
			}
		};
		Ext.apply(labelBindConfig, bindConfig);
		return labelBindConfig;
	},

	/**
	 * Returns a string from the css classes based on the configuration of the control
	 * @protected
	 * @return {String} Returns a string that contains a list of css classes
	 */
	getLabelClass: function() {
		var labelClass = [];
		labelClass.push(this.labelClass);
		if (this.wordWrap === false) {
			labelClass.push(this.noWordWrapClass);
		}
		if (this.isRequired === true) {
			labelClass.push(this.requiredClass);
		}
		if (this.enabled === false) {
			labelClass.push(this.disabledClass);
		}
		return labelClass.join(" ");
	},

	/**
	 * Returns the text inscription inside the element, taking into account the part of the text selected
	 * with a special html-tag.
	 * @protected
	 * @return {String} Text inside the element.
	 */
	getInnerHtml: function() {
		var htmlEncodedCaption = Terrasoft.encodeHtml(this.caption);
		if (this.isMultiline) {
			htmlEncodedCaption = htmlEncodedCaption.replace(/\n/g, "<br />");
		}
		var highlightText = this.highlightText;
		var tag = this.highlightTag;
		if (!tag || !highlightText || !this.caption) {
			return htmlEncodedCaption;
		}
		if (Ext.isString(highlightText)) {
			var replaceHighlightText = Ext.String.format("<{0}>{1}</{0}>", tag, highlightText);
			return htmlEncodedCaption.split(highlightText).join(replaceHighlightText);
		}
		Terrasoft.each(highlightText, function(text) {
			var replaceText = Ext.String.format("<{0}>{1}</{0}>", tag, text);
			htmlEncodedCaption = htmlEncodedCaption.split(text).join(replaceText);
		});
		return htmlEncodedCaption;
	},

	/**
	 * Returns the inline style object based on the configuration of the control.
	 * @protected
	 * @return {Object}
	 */
	getStyles: function() {
		var styles = {};
		styles.labelStyle = {};
		var labelStyle = styles.labelStyle;
		var font = this.font;
		var width = this.width;
		if (font) {
			labelStyle.font = font;
		}
		if (width) {
			labelStyle.width = width;
		}
		return styles;
	},

	/**
	 * @inheritdoc Terrasoft.Component#getSelectors
	 * @override
	 */
	getSelectors: function() {
		return {
			wrapEl: "#" + this.id,
			el: "#" + this.id
		};
	},

	/**
	 * Sets or removes line breaks.
	 * @param {Boolean} wordWrap If true - the line break is enabled, if false - line break is disabled.
	 */
	setWordWrap: function(wordWrap) {
		if (this.wordWrap === wordWrap) {
			return;
		}
		this.wordWrap = wordWrap;
		this.safeRerender();
	},

	/**
	 * @inheritdoc Terrasoft.controls.Component#initDomEvents
	 * @override
	 */
	initDomEvents: function() {
		this.callParent(arguments);
		var el = this.getWrapEl();
		el.on("click", this.onClick, this);
	},

	/**
	 * Handler of the click.
	 * @protected
	 */
	onClick: function(e) {
		if (!this.enabled) {
			return;
		}
		var canExecute = this.canExecute({
			method: this.onClick,
			args: arguments
		});
		var browserEvent = e.browserEvent;
		var shouldStopEvent = canExecute && this.fireEvent("click", this);
		if (shouldStopEvent === false) {
			Ext.EventManager.stopEvent(browserEvent);
		}
	},

	/**
	 * Sets the width of the element.
	 * @param {String} width The new width of the control, the string containing the css value for the width
	 */
	setWidth: function(width) {
		if (this.width === width) {
			return;
		}
		this.width = width;
		this.safeRerender();
	},

	/**
	 * Sets caption.
	 * @param {String|Object} caption Caption.
	 */
	setCaption: function(caption) {
		if (this.caption === caption) {
			return;
		}
		this.caption = Ext.isObject(caption) ? caption.displayValue : caption;
		this.updateDirection(this.caption);
		var wrapEl = this.getWrapEl();
		if (wrapEl && wrapEl.dom) {
			this.safeRerender();
		}
	},

	/**
	 * Sets the control as required
	 * @param {Boolean} isRequired If the value is set to true - the control is displayed with an asterisk,
	 * if it is false, it is displayed as common control.
	 */
	setRequired: function(isRequired) {
		if (this.isRequired === isRequired) {
			return;
		}
		this.isRequired = isRequired;
		if (!this.rendered) {
			return;
		}
		var wrapEl = this.getWrapEl();
		if (isRequired) {
			wrapEl.addCls(this.requiredClass);
		} else {
			wrapEl.removeCls(this.requiredClass);
		}
	},

	/**
	 * Sets the part of the caption that should be selected with a special html tag and updates the text inscription
	 * in the element.
	 * @param {String | String []} highlightText The part of the caption that should be selected with a special html tag.
	 */
	setHighlightText: function(highlightText) {
		if (this.isEqualHighlightText(highlightText)) {
			return;
		}
		this.highlightText = highlightText;
		var wrapEl = this.getWrapEl();
		if (wrapEl && wrapEl.dom) {
			wrapEl.dom.innerHTML = this.getInnerHtml();
		}
	},

	/**
	 * Check is equal highlightText with this.highlightText.
	 * @private
	 * @param {String|String[]} highlightText Text or array of text for highlights.
	 * @return {boolean} True if highlightText not changed.
	 */
	isEqualHighlightText: function(highlightText) {
		if (Ext.isArray(highlightText)) {
			Ext.Array.equals(this.highlightText, highlightText);
		}
		return this.highlightText === highlightText;
	},

	/**
	 * Sets the font of the element.
	 * @param {String} font String of font parameters.
	 */
	setFont: function(font) {
		if (this.font === font) {
			return;
		}
		this.font = font;
		this.safeRerender();
	},

	/**
	 * The method creates a label for the element id of which is equal to inputId.
	 * @param {String} inputId A string containing the element's id.
	 */
	setInputId: function(inputId) {
		if (this.inputId === inputId) {
			return;
		}
		this.inputId = inputId;
		this.safeRerender();
	}
});
