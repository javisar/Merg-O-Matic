/*-------------------------------------------------
		Quick Pager jquery plugin

		Copyright (C) 2011 by Dan Drayne

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		THE SOFTWARE.

		v1.1/		18/09/09 * bug fix by John V - http://blog.geekyjohn.com/
-------------------------------------------------*/

(function($) {
	$.fn.getPageCount = function(options) {
		return $(this).children().length/options.pageSize;
	};
	
	$.fn.createPageNav = function(selector, options) {
		//var selector = $(this)
		//var pageCount = $(this).children().length/options.pageSize;
		if (options.pageCount <= 0) options.pageCount = $.fn.getPageCount();
		var pageNav = "<ul class='simplePagerNav'>";
		for (i=1;i<=options.pageCounter;i++){
			if (i==options.currentPage) {
				pageNav += "<li class='currentPage simplePageNav"+i+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";
			}
			else {
				pageNav += "<li class='simplePageNav"+i+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";
			}
		}
		pageNav += "</ul>";
		pageNav = $(pageNav);

		if(!options.holder) {
			switch(options.pagerLocation)
			{
			case "before":
				selector.before(pageNav);
			break;
			case "both":
				selector.before(pageNav);
				selector.after(pageNav);
			break;
			default:
				selector.after(pageNav);
			}
		}
		else {
			$(options.holder).append(pageNav);
		}
		return pageNav;
	};
	
	$.fn.getPagerNavHeight = function(options) {		
		var navHeight = 0;
		var ee = this.each(function() {
			var selector = $(this);
			
			options.pageCounter = 1;

			//selector.wrap("<div class='simplePagerContainer'></div>");

			selector.children().each(function(i){

				if(i < options.pageCounter*options.pageSize && i >= (options.pageCounter-1)*options.pageSize) {
					//$(this).addClass("simplePagerPage"+options.pageCounter);
				}
				else {
					//$(this).addClass("simplePagerPage"+(options.pageCounter+1));
					options.pageCounter ++;
				}

			});

			// show/hide the appropriate regions
			//selector.children().hide();
			//selector.children(".simplePagerPage"+options.currentPage).show();

			if(options.pageCounter <= 1) {
				return;
			}
			var pageNav = $.fn.createPageNav(selector,options);
			
			navHeight += pageNav.outerHeight()+2;
			pageNav.remove();				
		});
		return navHeight;
	};
	
	$.fn.removeClassStartWith = function(elem, prefix) {
		var classes = elem.attr("class").split(" ");
		for (clas in classes) {
			if (classes[clas].indexOf(prefix, 0) >= 0) {
				elem.removeClass(classes[clas]);
				//classes =  elem.attr("class").split(" ");
			}
		}
	};
	
	$.fn.quickPager = function(options) {

		var defaults = {
			pageSize: 10,
			currentPage: 1,
			holder: null,
			pagerLocation: "after",
			pageCounter: 0
		};

		var options = $.extend(defaults, options);			

		return this.each(function() {

			var selector = $(this);
			
			options.pageCounter = 1;

			if (!selector.parent().hasClass("simplePagerContainer"))
				selector.wrap("<div class='simplePagerContainer'></div>");

			selector.children().each(function(i){

				$.fn.removeClassStartWith($(this),"simplePagerPage");

				if(i < options.pageCounter*options.pageSize && i >= (options.pageCounter-1)*options.pageSize) {
					$(this).addClass("simplePagerPage"+options.pageCounter);
				}
				else {
					$(this).addClass("simplePagerPage"+(options.pageCounter+1));
					options.pageCounter ++;
				}

			});

			// show/hide the appropriate regions
			selector.children().hide();
			selector.children(".simplePagerPage"+options.currentPage).show();

			if(options.pageCounter <= 1) {
				return;
			}
			/*
			//Build pager navigation
			var pageNav = "<ul class='simplePagerNav'>";
			for (i=1;i<=options.pageCounter;i++){
				if (i==options.currentPage) {
					pageNav += "<li class='currentPage simplePageNav"+i+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";
				}
				else {
					pageNav += "<li class='simplePageNav"+i+"'><a rel='"+i+"' href='#'>"+i+"</a></li>";
				}
			}
			pageNav += "</ul>";

			if(!options.holder) {
				switch(options.pagerLocation)
				{
				case "before":
					selector.before(pageNav);
				break;
				case "both":
					selector.before(pageNav);
					selector.after(pageNav);
				bault:
					selector.after(pageNav);
				}
			}
			else {
				$(options.holder).append(pageNav);
			}
			*/
			selector.parent().find(".simplePagerNav").remove()
			var pageNav = $.fn.createPageNav(selector,options);

			//pager navigation behaviour
			selector.parent().find(".simplePagerNav a").click(function() {

				//grab the REL attribute
				var clickedLink = $(this).attr("rel");
				options.currentPage = clickedLink;

				if(options.holder) {
					$(this).parent("li").parent("ul").parent(options.holder).find("li.currentPage").removeClass("currentPage");
					$(this).parent("li").parent("ul").parent(options.holder).find("a[rel='"+clickedLink+"']").parent("li").addClass("currentPage");
				}
				else {
					//remove current current (!) page
					$(this).parent("li").parent("ul").parent(".simplePagerContainer").find("li.currentPage").removeClass("currentPage");
					//Add current page highlighting
					$(this).parent("li").parent("ul").parent(".simplePagerContainer").find("a[rel='"+clickedLink+"']").parent("li").addClass("currentPage");
				}

				//hide and show relevant links
				selector.children().hide();
				selector.find(".simplePagerPage"+clickedLink).show();

				return false;
			});						
			
			//--------------//			
		});
	}


})(jQuery);
