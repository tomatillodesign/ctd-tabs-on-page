<?php
$tab_label = get_field('tab_label') ?: 'Tab';
$tab_slug = sanitize_title($tab_label);
?>
<div class="ctd-single-tab">
  
  <!-- Tab Button -->
  <button
      role="tab"
      aria-selected="false"
      aria-controls="<?php echo esc_attr($tab_slug); ?>"
      data-tab-slug="<?php echo esc_attr($tab_slug); ?>">
    <?php echo esc_html($tab_label); ?>
  </button>

  <!-- Tab Content Panel -->
  <div
      id="<?php echo esc_attr($tab_slug); ?>"
      class="ctd-tabs__single_tab ctd-single-tab-contents-outer-wrapper"
      role="tabpanel"
      hidden>
    
    <!-- Automatic Heading inside the Tab Panel -->
    <h2 class="ctd-tab-heading"><?php echo esc_html($tab_label); ?></h2>

    <!-- User Content -->
     <div class="ctd-single-tab-contents-inner-wrapper">
      <InnerBlocks />
    </div>

  </div>

</div>
