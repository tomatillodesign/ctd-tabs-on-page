(function($) {
    console.log('ACF Slug Preview Script Loaded.');
  
    acf.addAction('append_field', function(field) {
      console.log('ACF append_field hook triggered:', field);
  
      if (!field.data || !field.data.name) {
        console.warn('Field missing name, skipping.');
        return;
      }
  
      console.log('Field name:', field.data.name);
  
      if (field.data.name !== 'tab_group_id') {
        console.log('Skipping non-tab_group_id field:', field.data.name);
        return;
      }
  
      console.log('Target field found:', field);
  
      var $input = field.$el.find('input');
  
      if (!$input.length) {
        console.warn('No input inside field.');
        return;
      }
  
      console.log('Input field located:', $input);
  
      if (field.$el.find('.ctd-slug-preview').length) {
        console.log('Slug preview already exists.');
        return;
      }
  
      var $preview = $('<div class="ctd-slug-preview" style="margin-top:8px; font-size:13px; color:#667085; line-height: 1.5;">Slug: <span>(none)</span></div>');
  
      $input.after($preview);
      console.log('Inserted slug preview element.');
  
      function updatePreview() {
        var value = $input.val();
        console.log('Input value:', value);
  
        if (!value) {
          $preview.find('span').text('(none)');
          return;
        }
  
        var slug = value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        console.log('Generated slug:', slug);
  
        $preview.find('span').text(slug);
      }
  
      updatePreview();
  
      $input.on('input', function() {
        console.log('Input changed.');
        updatePreview();
      });
  
      console.log('Slug preview fully setup.');
    });
  })(jQuery);
  