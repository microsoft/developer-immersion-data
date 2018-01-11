<?php
/*
Template Name: speedtest
*/
?>
<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package storefront
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">

			<?php 	


//include ($_SERVER['SERVER_NAME'].'/speedtest.php');

//Establishes the connection
$conn = mysqli_init();
mysqli_real_connect($conn, DB_HOST, DB_USER, DB_PASSWORD, "employees", 3306);
if (mysqli_connect_errno($conn)) {
die('Failed to connect to MySQL: '.mysqli_connect_error());
}

//Run the Select query
printf("Starting... <br/>");

$sql = '...';


for ($i = 1; $i <= 5; $i++) {
$msc = microtime(true);
mysqli_query($conn, 'select SQL_NO_CACHE * from employees.dept_emp_latest_date');
$msc = microtime(true)-$msc;
echo "iteration: " . $i . ":  " .  number_format((float)$msc, 2, '.', '') . ' seconds<br/>'; // in seconds
}



//Close the connection
mysqli_close($conn);

?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
do_action( 'storefront_sidebar' );
get_footer();
