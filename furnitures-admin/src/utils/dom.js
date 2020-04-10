/**
 * DOM操作类
 * @summary DOM操作类
 * @namespace Utils.DOM
 * @author shlijian
 * @version 1.1
 * @since 2016/2/17
 */
export default {
	byId: function(name) {
		return name ? document.getElementById(name) : null;
	},
	byName: function(name) {
		return document.getElementsByName(name);
	},
	byTagName: function(o, name) {
		o = o ? o : document;
		var els = o.getElementsByTagName(name);
		return els ? els : [];
	},
	preventDefault: function(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		} else {
			window.event.returnValue = false;
		}
	},
	stopPropagation: function(e) {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else {
			window.event.cancelBubble = true;
		}
	},
	getEvent: function() {
		if (window.event) {
			return window.event;
		}
		/*var func = arguments.caller;
        while (func != null) {
            var e = func.arguments[0];
            if (e) {
                if ((e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent) || (typeof e === 'object' && e.preventDefault && e.stopPropagation)) {
                    return e;
                }
            }
            func = func.caller;
        }*/
		return null;
	},
	offset: function(obj) {
		var pos = {
			top: 0,
			left: 0
		};

		const getPos = function(o) {
			if (o) {
				pos.top += o.offsetTop;
				pos.left += o.offsetLeft;
				getPos(o.offsetParent);
			}
		};

		getPos(obj);
		return pos;
	},
	getSize: function(o) {
		return o
			? {
					w: o.clientWidth || o.offsetWidth,
					h: o.clientHeight || o.offsetHeight
			  }
			: {
					w:
						/*window.innerWidth||*/ document.documentElement.clientWidth ||
						document.body.offsetWidth,
					h:
						/*window.innerHeight||*/ document.documentElement.clientHeight ||
						document.body.offsetHeight
			  };
	},
	getMousePos: function(e) {
		var ret = {};
		e = e || this.getEvent();
		if (!isNaN(e.pageX) && !isNaN(e.pageY)) {
			ret.x = e.pageX;
			ret.y = e.pageY;
		} else if (
			document.documentElement &&
			!isNaN(e.clientX) &&
			!isNaN(document.documentElement.scrollTop)
		) {
			ret.x =
				e.clientX +
				document.documentElement.scrollLeft -
				document.documentElement.clientLeft;
			ret.y =
				e.clientY + document.documentElement.scrollTop - document.documentElement.clientTop;
		} else if (document.body && !isNaN(e.clientX) && !isNaN(document.body.scrollLeft)) {
			ret.x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
			ret.y = e.clientY + document.body.scrollTop - document.body.clientTop;
		}
		return ret;
	},
	getScrollPos: function() {
		var ret = {
			x: document.body.scrollLeft - document.body.clientLeft,
			y: document.body.scrollTop - document.body.clientTop
		};
		if (document.documentElement) {
			ret.x = Math.max(
				document.documentElement.scrollLeft - document.documentElement.clientLeft,
				ret.x
			);
			ret.y = Math.max(
				document.documentElement.scrollTop - document.documentElement.clientTop,
				ret.y
			);
		}
		return ret;
	},
	setOpacity: function(node, value) {
		if (node.setCapture) {
			node.style.filter = "alpha(opacity=" + value + ")";
		} else {
			node.style.opacity = value / 100;
		}
	},
	/**
	 * 追加元素
	 * @method insertAfter
	 * @param {Object} [newElement] 要追加的元素
	 * @param {Object} [targetElement] 指定元素的位置
	 */
	insertAfter: function(newElement, targetElement) {
		var parent = targetElement.parentNode; //找到指定元素的父节点
		if (parent.lastChild == targetElement) {
			//判断指定元素的是否是节点中的最后一个位置 如果是的话就直接使用appendChild方法
			parent.appendChild(newElement, targetElement);
		} else {
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}
};
