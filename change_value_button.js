
define(['jquery', 'fab/element'], function (jQuery, FbElement) {
    window.FbChange_value_button = new Class({
        Extends   : FbElement,
        initialize: function (element, options) {
            this.setPlugin('fabrikChange_value_button');
            this.parent(element, options);

            this.removeLabel();

            var button = document.getElementById('cvb_button'), self = this;
            button.onclick = function () {
                var c = confirm(self.options.alertConfirm), a;
                if (c === true) {
                    self.changeValue();
                }
            }

        },
        removeLabel: function () {
            var field, fieldChilds, child, i;
            field = document.getElementsByClassName('fb_el_' + this.options.element)[0];
            fieldChilds = field.childNodes;

            for (i=0; i<fieldChilds.length; i++) {
                child = fieldChilds[i];
                if ((child.nodeName !== '#text') && (child.nodeName !== '#comment')) {
                    if (child.className === 'fabrikLabel') {
                        child.remove();
                    }
                }
            }
        },
        insertLoading: function () {
            var page = document.getElementById('g-page-surround');
            var body = document.getElement('body');
            body.style.overflow = 'hidden';

            var loading = document.createElement('div');
            loading.setAttribute('id', 'cvb_loading');
            loading.setAttribute('style', 'position: absolute;\n' +
                '  top: 0px;\n' +
                '  left: 0px;\n' +
                '  z-index: 100;\n' +
                '  background-color: #000;\n' +
                '  opacity: 0.5;\n' +
                '  width: 100%;\n' +
                '  height: 100%;\n' +
                '  display: block;' +
                '  text-align: center;');
            var img = document.createElement('img');
            img.setAttribute('src', 'https://static.wixstatic.com/media/9bd62a_40c8fc9e5a794e9fad1655b05c3d7e0c~mv2.gif');
            img.setAttribute('id', 'cvb_loading_img');
            img.setAttribute('style', 'position: fixed; top: 40%; left: 42%; z-index: 1000;');

            loading.appendChild(img);
            page.appendChild(loading);
        },
        removeLoading: function() {
            var loading = document.getElementById('cvb_loading');
            var body = document.getElement('body');

            loading.remove();
            body.style.overflow = 'auto';
        },
        changeValue: function () {
            var self = this;
            jQuery.ajax ({
                url: Fabrik.liveSite + 'index.php',
                method: "POST",
                data: {
                    'option': 'com_fabrik',
                    'format': 'raw',
                    'task': 'plugin.pluginAjax',
                    'plugin': 'change_value_button',
                    'method': 'changeValue',
                    'g': 'element',
                    'formId': this.options.formId,
                    'rowId': this.options.rowId,
                    'table': this.options.table,
                    'elementName': this.options.elementName,
                    'fieldValue': this.options.fieldValue
                },
                beforeSend: function () {
                    self.insertLoading();
                }
            }).done (function (data) {
                self.removeLoading();
                setTimeout(function(){
                    alert(self.options.alertSuccess);
                }, 100);
            });
        }
    });

    return window.FbChange_value_button;
});