<?php
$tab_group_id = get_field('tab_group_id') ?: '';
$tab_group_id = sanitize_title($tab_group_id);

// Get block align class if it exists
$align_class = isset($block['align']) ? 'align' . $block['align'] : '';

?>

<div class="ctd-tabs <?php echo esc_attr($align_class); ?>" data-tab-group-id="<?php echo esc_attr($tab_group_id); ?>">

  <?php if (is_admin() && $tab_group_id) : ?>
    <div class="ctd-tab-group-id">
      Tab Group ID: <?php echo esc_html($tab_group_id); ?>
    </div>
  <?php endif; ?>

  <div class="ctd-tabs__toc" role="tablist">
    <InnerBlocks allowedBlocks='["acf/single-tab"]' />
  </div>

  <div class="ctd-tabs__content">
    <!-- JS will move panels here -->
  </div>

</div>
