import Rails from 'rails-ujs';

// =========================================================================
// Cocoon 1.2.12
// cocoon.js rebuild sans-jquery
//
// Hard Requirements
// - Rails-ujs
//
// Optional polyfills
// - node.closest
//
// Missing features
// - Skipping cocoon:after-insert by calling event.preventDefault
//   during cocoon:before-insert, this is due to the jQuery
//   method event.isDefaultPrevented needing a polyfill or
//   alternative
// - Untested in IE10 or below
// 
// Possible issues
// - Non-dynamic removals may inject values in to the wrong field
//   $this.parentNode.querySelector("input[type=hidden]").val("1");
//   this was previous $this.prev("input[type=hidden]")
//   if the repeater contains hidden input fields this could
//   cause issues
//
// Breaking changes
// - insertion-method has changed to have value-parity with
//   node.insertAdjacentHTML(), default changing from "before" to
//   "beforeBegin". Possible values are "beforeBegin", "afterBegin",
//   "beforeEnd" or "afterEnd".
// =========================================================================

(function(Rails) {

  var cocoon_element_counter = 0;

  var create_new_id = function() {
    return (new Date().getTime() + cocoon_element_counter++);
  }

  var newcontent_braced = function(id) {
    return '[' + id + ']$1';
  }

  var newcontent_underscord = function(id) {
    return '_' + id + '_$1';
  }

  var getInsertionNodeElem = function(insertionNode, insertionTraversal, $this){

    if (!insertionNode){
      return $this.parentNode;
    }

    if (typeof insertionNode == 'function'){
      if(insertionTraversal){
        console.warn('association-insertion-traversal is ignored, because association-insertion-node is given as a function.')
      }
      return insertionNode($this);
    }

    if(typeof insertionNode == 'string'){
      if (insertionTraversal){
        return $this[insertionTraversal](insertionNode);
      }else{
        return insertionNode == "this" ? $this : document.querySelector(insertionNode);
      }
    }

  }

  Rails.delegate(document, '.add_fields', 'click', function(e) {
    e.preventDefault();
    var $this                 = e.target,
        assoc                 = $this.getAttribute('data-association') || "",
        assocs                = $this.getAttribute('data-associations') || "",
        content               = $this.getAttribute('data-association-insertion-template') || "",
        insertionMethod       = $this.getAttribute('data-association-insertion-method') || $this.getAttribute('data-association-insertion-position') || 'beforeBegin',
        insertionNode         = $this.getAttribute('data-association-insertion-node') || "",
        insertionTraversal    = $this.getAttribute('data-association-insertion-traversal') || "",
        count                 = parseInt($this.getAttribute('count'), 10),
        regexp_braced         = new RegExp('\\[new_' + assoc + '\\](.*?\\s)', 'g'),
        regexp_underscord     = new RegExp('_new_' + assoc + '_(\\w*)', 'g'),
        new_id                = create_new_id(),
        new_content           = content.replace(regexp_braced, newcontent_braced(new_id)),
        new_contents          = [];


    if (new_content == content) {
      regexp_braced     = new RegExp('\\[new_' + assocs + '\\](.*?\\s)', 'g');
      regexp_underscord = new RegExp('_new_' + assocs + '_(\\w*)', 'g');
      new_content       = content.replace(regexp_braced, newcontent_braced(new_id));
    }

    new_content = new_content.replace(regexp_underscord, newcontent_underscord(new_id));
    new_contents = [new_content];

    count = (isNaN(count) ? 1 : Math.max(count, 1));
    count -= 1;

    while (count) {
      new_id      = create_new_id();
      new_content = content.replace(regexp_braced, newcontent_braced(new_id));
      new_content = new_content.replace(regexp_underscord, newcontent_underscord(new_id));
      new_contents.push(new_content);

      count -= 1;
    }

    var insertionNodeElem = getInsertionNodeElem(insertionNode, insertionTraversal, $this)

    if( !insertionNodeElem || (insertionNodeElem.length == 0) ){
      console.warn("Couldn't find the element to insert the template. Make sure your `data-association-insertion-*` on `link_to_add_association` is correct.")
    }

    new_contents.forEach(function(contentNode) {
      var before_insert = 'cocoon:before-insert';
      Rails.fire(insertionNodeElem, before_insert, [contentNode]);

      if (true /*!before_insert.isDefaultPrevented()*/) {
        // allow any of the jquery dom manipulation methods (after, before, append, prepend, etc)
        // to be called on the node.  allows the insertion node to be the parent of the inserted
        // code and doesn't force it to be a sibling like after/before does. default: 'before'

        // var addedContent = insertionNodeElem[insertionMethod](contentNode);
        var addedContent = insertionNodeElem.insertAdjacentHTML(insertionMethod, contentNode);

        Rails.fire(insertionNodeElem, 'cocoon:after-insert', [contentNode]);
      }
    });
  });

  Rails.delegate(document, '.remove_fields.dynamic, .remove_fields.existing', 'click', function(e) {
    var $this = e.target,
        wrapper_class = $this.getAttribute('data-wrapper-class') || 'nested-fields',
        node_to_delete = $this.closest('.' + wrapper_class),
        trigger_node = node_to_delete.parentNode;

    e.preventDefault();

    var before_remove = 'cocoon:before-remove';
    Rails.fire(trigger_node, before_remove, [node_to_delete]);

    if (true /*!before_remove.isDefaultPrevented()*/) {
      var timeout = trigger_node.getAttribute('data-remove-timeout') || 0;

      setTimeout(function() {
        if ($this.classList.contains('dynamic')) {
            node_to_delete.remove();
        } else {
            $this.parentNode.querySelector("input[type=hidden]").val("1");
            node_to_delete.style.display = "none";
        }
        Rails.fire(trigger_node, 'cocoon:after-remove', [node_to_delete])
      }, timeout);
    }
  });

  document.addEventListener("ready page:load turbolinks:load", function() {
    var items = document.querySelectorAll('.remove_fields.existing.destroyed');
    for(i = 0; i === items.length; i++){
      var $this = items[i],
          wrapper_class = $this.getAttribute('data-wrapper-class') || 'nested-fields';
      $this.closest('.' + wrapper_class).style.display("none");
    }
  });

})(Rails);
