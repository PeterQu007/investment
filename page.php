<?php
 while(have_posts()){
        the_post();
        echo the_title();
        echo the_permalink();
        echo the_content();
      
      }
?>