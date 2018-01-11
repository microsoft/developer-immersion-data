<?php
/*
 * @package mywebtonet performance statistics
 * @version 1.2.1
*/
/*
Plugin Name: PHP/MySQL CPU performance statistics
Plugin URI: http://wordpress.org/plugins/mywebtonet-performancestats/
Description: A benchmark plugin that dynotests CPU performance on your web and MySQL server and does a network bandwidth test.
Author: Mywebtonet.com / Webhosting.dk
Version: 1.2.1
Author URI: http://www.webhosting.dk 
*/

$mysqlquerydata = str_repeat ("X" , 1000 );
$ourdatamysql53 = array("Query test" => 0.30,"MySQL 1" => 3.52,"MySQL 2" => 1.10,"MySQL 3" => 0.48);	
$ourdatamysql54 = array("Query test" => 0.32,"MySQL 1" => 3.53,"MySQL 2" => 1.13,"MySQL 3" => 0.50);	
$ourdatamysql55 = array("Query test" => 0.31,"MySQL 1" => 3.51,"MySQL 2" => 1.11,"MySQL 3" => 0.49);	
$ourdatamysql70 = array("Query test" => 0.32,"MySQL 1" => 3.56,"MySQL 2" => 1.14,"MySQL 3" => 0.50);
$ourdataphp53 = array("PHP 1" => 0.34,"PHP 2" => 0.70,"PHP 3" => 0.40,"PHP 4" => 0.64);	
$ourdataphp54 = array("PHP 1" => 0.30,"PHP 2" => 0.63,"PHP 3" => 0.30,"PHP 4" => 0.36);	
$ourdataphp55 = array("PHP 1" => 0.29,"PHP 2" => 0.62,"PHP 3" => 0.24,"PHP 4" => 0.30);	
$ourdataphp70 = array("PHP 1" => 0.10,"PHP 2" => 0.31,"PHP 3" => 0.16,"PHP 4" => 0.34);	
$runquerycount = 200;

if ( !defined('ABSPATH') ) {
	echo "<center>You cant do this";
        exit();
}

$mysqltests =array("select BENCHMARK(500000000, EXTRACT(YEAR FROM NOW()))","select BENCHMARK(10000000,ENCODE('hello','goodbye'))","select BENCHMARK(25000000,1+1*2);");

add_action('plugins_loaded', 'myweb_init');
add_action('admin_menu', 'mywebtonetperftest_plugin_menu');

function myweb_init() {
	$pathinfo = pathinfo(dirname(plugin_basename(__FILE__)));  
        if (!defined('MYWEB_NAME')) define('MYWEB_NAME', $pathinfo['filename']);
	if (!defined('MYWEB_URL')) define('MYWEB_URL', plugins_url(MYWEB_NAME) . '/');

}                   
                     
function mywebtonetperftest_showfromdb($showtype) {
	global $wpdb;
	global $ourdatamysql70;
	global $ourdataphp70;
	global $runquerycount;
	global $headertext;

	$phpmajorversion= PHP_MAJOR_VERSION;

	$tableprefix = $wpdb->prefix."mywebtonetperfstatsresults";
	mywebtonetperftest_createtable();
	?>
	<center>
	
	<?php
	if ($showtype == "fast") {
		$headertext = "Best time";
		$getdata = $wpdb->get_results("select sum(mysql1+mysql2+mysql3+queryresult) as mysqlresult,sum(php1+php2+php3+php4) as phpresult,uniqid, servername, serveraddr, memorylimit,phpversion,postmaxsize,mysqlversion,phpos,serverloadnow,serverload5,serverload15,mysql1,mysql2,mysql3,php1,php2,php3,php4,deleteable,DATE_FORMAT(dt, '%W %D %M %Y %T') as tt,phpuname,queryresult,networktest,maxexectime,apacheversion,uploadmaxsize from $tableprefix where deleteable=1 group by uniqid order by mysqlresult asc limit 1;");
	}	
	if ($showtype == "slow") {
		$headertext = "Slowest time";
		$getdata = $wpdb->get_results("select sum(mysql1+mysql2+mysql3+queryresult) as mysqlresult,sum(php1+php2+php3+php4) as phpresult,uniqid, servername, serveraddr, memorylimit,phpversion,postmaxsize,mysqlversion,phpos,serverloadnow,serverload5,serverload15,mysql1,mysql2,mysql3,php1,php2,php3,php4,deleteable,DATE_FORMAT(dt, '%W %D %M %Y %T') as tt,phpuname,queryresult,networktest,maxexectime,apacheversion,uploadmaxsize from $tableprefix where deleteable=1 group by uniqid order by mysqlresult desc limit 1;");
	}	

	foreach ( $getdata as $getdata ) {
	}
	if ($getdata->uniqid == "") {
		echo "<center><H4>You need to run a test first</h4>";
		exit;
	}

	$cresult = sprintf("%0.0f",$runquerycount /$getdata->queryresult);
	?>
	<table width='95%'><tr><td width='40%'></td><td width='20%'><h3><?php echo $headertext ?></h3></td><td width='40%' align='right'><a href='http://www.mywebtonet.com' target=_blank><img src="<?php echo MYWEB_URL; ?>/mywebtonetlogo.png" border=0></a></td></tr></table>		
	<table width='95%' cellpadding=2 cellspacing=2 style='background: #FFFFFF;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;border: 2px solid #cccccc;'>
	<tr><td width=50%>
	<table border=0>
	<tr><td valign='top' align='left'>Time of test</td><td valign='top' align='left'><font color='blue'><a href='http://<?php echo $getdata->servername ?>' target=_blank</a><?php echo $getdata->tt;?></font></td></tr>
	<tr><td valign='top' align='left'>Server name</td><td valign='top' align='left'><font color='blue'><a href='http://<?php echo $getdata->servername ?>' target=_blank</a><?php echo $getdata->servername;?></font></td></tr>
	<tr><td valign='top' align='left'>Server Addr</td><td valign='top' align='left'><font color='blue'><?php echo $getdata->serveraddr;?></font></td></tr>
	<tr><td valign='top' align='left'>Host OS</td><td valign='top' align='left'><?php echo $getdata->phpos;?></td></tr>
	<tr><td valign='top' align='left'>Webserver type</td><td valign='top' align='left'><?php echo $getdata->apacheversion;?></td></tr>
	<tr><td><br></td></tr>
	<tr><td valign='top' align='left'><b>Server load statistics</b></td></tr>
	<tr><td valign='top' align='left'>Load now</td><td valign='top' align='left'><font color='blue'><?php echo $getdata->serverloadnow;?></td></tr>
	<tr><td valign='top' align='left'>Load 5 min</td><td valign='top' align='left'><?php echo $getdata->serverload5;?></td></tr>
	<tr><td valign='top' align='left'>Load 15 min</td><td valign='top' align='left'><?php echo $getdata->serverload15;?></td></tr>
	<tr><td><br></td></tr>
	<tr><td valign='top' align='left'><b>PHP statistics</b></td></tr>
	<tr><td valign='top' align='left'>PHP uname</td><td valign='top' align='left'><?php echo $getdata->phpuname;?></td></tr>
	<tr><td valign='top' align='left'>PHP version</td><td valign='top' align='left'><?php echo $getdata->phpversion;?></td></tr>
	<tr><td valign='top' align='left'>PHP memory limit</td><td valign='top' align='left'><font color='blue'><?php echo $getdata->memorylimit;?></td></tr>
	<tr><td valign='top' align='left'>PHP post_max_size</td><td valign='top' align='left'><font color='blue'><?php echo $getdata->postmaxsize;?></td></tr>
	<tr><td valign='top' align='left'>PHP upload_max_filesize</td><td valign='top' align='left'><font color='blue'><?php echo $getdata->uploadmaxsize;?></td></tr>
	<tr><td valign='top' align='left'>PHP max_execution_time</td><td valign='top' align='left'><font color='blue'><?php echo $getdata->maxexectime;?></td></tr>
	<tr><td valign='top' align='left'>PHP test 1</td><td valign='top' align='left'><?php echo $getdata->php1;?></td></tr>
	<tr><td valign='top' align='left'>PHP test 2</td><td valign='top' align='left'><?php echo $getdata->php2;?></td></tr>
	<tr><td valign='top' align='left'>PHP test 3</td><td valign='top' align='left'><?php echo $getdata->php3;?></td></tr>
	<tr><td valign='top' align='left'>PHP test 4</td><td valign='top' align='left'><?php echo $getdata->php4;?></td></tr>
	<tr><td valign='top' align='left'>PHP total time</td><td valign='top' align='left'><?php echo sprintf("<font color='blue'><b>%10.2f</b>",$getdata->phpresult);?></td></tr>
	<tr><td valign='top' align='left'>PHP performance Index</td><td valign='top' align='left'><font color='blue'><b><?php echo sprintf("%10.0f",10000/($getdata->phpresult));?></b></font></td></tr>
	<tr><td><br></td></tr>
	<tr><td valign='top' align='left'><b>MySQL statistics</b></td></tr>
	<tr><td valign='top' align='left'>MySQL version</td><td valign='top' align='left'><?php echo $getdata->mysqlversion;?></td>
	<tr><td valign='top' align='left'>MySQL Query</td><td valign='top' align='left'><?php echo $getdata->queryresult;?> seconds (<b><?php echo $cresult ?></b> / second)</td>
	<tr><td valign='top' align='left'>MySQL 1</td><td valign='top' align='left'><?php echo $getdata->mysql1;?></td></tr>
	<tr><td valign='top' align='left'>MySQL 2</td><td valign='top' align='left'><?php echo $getdata->mysql2;?></td></tr>
	<tr><td valign='top' align='left'>MySQL 3</td><td valign='top' align='left'><?php echo $getdata->mysql3;?></td></tr>
	<tr><td valign='top' align='left'>MySQL total time</td><td valign='top' align='left'><font color='blue'><b><?php echo $getdata->mysqlresult;?></b></td></tr>
	<tr><td valign='top' align='left'>MySQL performance Index</td><td valign='top' align='left'><font color='blue'><b><?php echo sprintf("%10.0f",10000/(($getdata->mysqlresult)/3));?></b></td></tr>
	<tr><td><br></td></tr>
	<tr><td valign='top' align='left'><b>Network test</b></td></tr>
	<tr><td valign='top' align='left'>Fetch data from nearest google CDN point</td><td valign='top' align='left'><font color='blue'><b><?php echo $getdata->networktest;?></b></font> Mbps</td></tr>
	<tr><td><br></td></tr>
	<tr><td valign='top' align='left'><b>Summary</b></td></tr>
	<tr><td valign='top' align='left'>Total</td><td valign='top' align='left'><font color='blue'><b><?php echo sprintf("%10.2f",$getdata->phpresult+$getdata->mysqlresult);?></b></font></td>
	</table>
	<?php
		$datamysql = array("Query result" => $getdata->queryresult,"MySQL 1" => $getdata->mysql1,"MySQL 2" => $getdata->mysql2,"MySQL 3" => $getdata->mysql3);	
		$dataphp = array("PHP 1" => $getdata->php1,"PHP 2" => $getdata->php2,"PHP 3" => $getdata->php3,"PHP 4" => $getdata->php4);	

	?>		
		<?php if ($phpmajorversion<8) { ?>
		<td valign='top' align='left'>
			<table>
			<tr>
			<td><img src="<?php echo MYWEB_URL; ?>showgraphpie.php?showsmall=1&header=<?php echo urlencode(serialize("MySQL results")); ?>&mydata=<?php echo urlencode(serialize($datamysql)); ?>" /></td>
			<td><img src="<?php echo MYWEB_URL; ?>showgraphpie.php?showsmall=1&header=<?php echo urlencode(serialize("PHP results")); ?>&mydata=<?php echo urlencode(serialize($dataphp)); ?>" /></td>
			<br>
			</tr>
			<tr>	
			<td><img src="<?php echo MYWEB_URL; ?>showgraph.php?showsmall=1&header=<?php echo urlencode(serialize("Lower is better, Ours=Green, Your server=Blue")); ?>&mywebdata=<?php echo urlencode(serialize($ourdatamysql70));?>&mydata=<?php echo urlencode(serialize($datamysql)); ?>" /></td>
			<td><img src="<?php echo MYWEB_URL; ?>showgraph.php?showsmall=1&header=<?php echo urlencode(serialize("Lower is better, Ours=Green, Your server=Blue")); ?>&mywebdata=<?php echo urlencode(serialize($ourdataphp70)); ?>&mydata=<?php echo urlencode(serialize($dataphp)); ?>" /></td>
			</tr>	
			</table>		
		</td>
		<?php } ?>
		
	</td></tr>
	</table>
	<?php	
}


function mywebtonetperftest_showlist() {
	global $wpdb;
	global $ourdatamysql53;
	global $ourdatamysql54;
	global $ourdatamysql55;
	global $ourdatamysql70;
	global $ourdataphp53;
	global $ourdataphp54;
	global $ourdataphp55;
	global $ourdataphp70;
	global $headertext;
	global $phpversion;
	global $mysqlversion;

	mywebtonetperftest_createtable();
	$mysqltotal53 = sprintf("%10.2f",$ourdatamysql53["Query test"] + $ourdatamysql53["MySQL 1"] + $ourdatamysql53["MySQL 2"] + $ourdatamysql53["MySQL 3"]);
	$mysqltotal54 = sprintf("%10.2f",$ourdatamysql54["Query test"] + $ourdatamysql54["MySQL 1"] + $ourdatamysql54["MySQL 2"] + $ourdatamysql54["MySQL 3"]);
	$mysqltotal55 = sprintf("%10.2f",$ourdatamysql55["Query test"] + $ourdatamysql55["MySQL 1"] + $ourdatamysql55["MySQL 2"] + $ourdatamysql55["MySQL 3"]);
	$mysqltotal70 = sprintf("%10.2f",$ourdatamysql70["Query test"] + $ourdatamysql70["MySQL 1"] + $ourdatamysql70["MySQL 2"] + $ourdatamysql70["MySQL 3"]);
	//
	$phptotal53 = sprintf("%10.2f",$ourdataphp53["PHP 1"] + $ourdataphp53["PHP 2"] + $ourdataphp53["PHP 3"]  + $ourdataphp53["PHP 4"]);
	$phptotal54 = sprintf("%10.2f",$ourdataphp54["PHP 1"] + $ourdataphp54["PHP 2"] + $ourdataphp54["PHP 3"]  + $ourdataphp54["PHP 4"]);
	$phptotal55 = sprintf("%10.2f",$ourdataphp55["PHP 1"] + $ourdataphp55["PHP 2"] + $ourdataphp55["PHP 3"]  + $ourdataphp55["PHP 4"]);
	$phptotal70 = sprintf("%10.2f",$ourdataphp70["PHP 1"] + $ourdataphp70["PHP 2"] + $ourdataphp70["PHP 3"]  + $ourdataphp70["PHP 4"]);
	$tableprefix = $wpdb->prefix."mywebtonetperfstatsresults";
	$totaltime53 = sprintf("%10.2f",$mysqltotal53+$phptotal53);
	$totaltime54 = sprintf("%10.2f",$mysqltotal54+$phptotal54);
	$totaltime55 = sprintf("%10.2f",$mysqltotal55+$phptotal55);
	$totaltime70 = sprintf("%10.2f",$mysqltotal70+$phptotal70);
	$phpperformanceindex53= sprintf("%10.0f",10000/($phptotal53));
	$phpperformanceindex54= sprintf("%10.0f",10000/($phptotal54));
	$phpperformanceindex55= sprintf("%10.0f",10000/($phptotal55));
	$phpperformanceindex70= sprintf("%10.0f",10000/($phptotal70));
	$mysqlperformanceindex53= sprintf("%10.0f",10000/($mysqltotal53/3));
	$mysqlperformanceindex54= sprintf("%10.0f",10000/($mysqltotal54/3));
	$mysqlperformanceindex55= sprintf("%10.0f",10000/($mysqltotal55/3));
	$mysqlperformanceindex70= sprintf("%10.0f",10000/($mysqltotal70/3));
	
	?>
	<br>
	P.I = PHP performance Index<br>
	M.I = MySQL performance Index<br>
	<table width='95%'><tr><td width='40%'></td><td width='20%'><h3><?php echo $headertext ?></h3></td><td width='40%' align='right'><a href='http://www.mywebtonet.com' target=_blank><img src="<?php echo MYWEB_URL; ?>mywebtonetlogo.png" border=0></a></td></tr></table>	
	<table width='95%' border=1 cellpadding=1 cellspacing=1 style='background: #FFFFFF;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;border: 2px solid #cccccc;'>
	<tr><td>Time of test</td><td>Server name</td><td>Server addr</td><td>PHP version</td><td>MySQL version</td><td>MySQL test time</td><td>PHP Test time</td><td>Total time</td><td>P.I</td><td>M.I</td></tr>	
	<?php
	echo "<tr><td>Sunday 26nd January 2014 07:31:32</td>
		<td>MyWebToNet PHP 5.3 server</td>
		<td>81.19.232.65</td><td>5.3.28</td>
		<td>5.6.15</td>
		<td>$mysqltotal53</td>
		<td>$phptotal53</td>
		<td><font color='blue'><b>$totaltime53</b></font></td>
		<td><font color='blue'><b>$phpperformanceindex53</b></font></td>
		<td><font color='blue'><b>$mysqlperformanceindex53</b></font></td>
		</tr>";
	echo "<tr><td>Sunday 26nd January 2014 07:33:08</td>
		<td>MyWebToNet PHP 5.4 server</td>
		<td>81.19.232.55</td><td>5.4.24</td>
		<td>5.6.15</td>
		<td>$mysqltotal54</td>
		<td>$phptotal54</td>
		<td><font color='blue'><b>$totaltime54</b></font></td>
		<td><font color='blue'><b>$phpperformanceindex54</b></font></td>
		<td><font color='blue'><b>$mysqlperformanceindex54</b></font></td>
		</tr>";
	echo "<tr><td>Sunday 26nd January 2014 07:36:08</td>
		<td>MyWebToNet PHP 5.5 server</td>
		<td>81.7.161.141</td><td>5.5.8</td>
		<td>5.6.15</td>
		<td>$mysqltotal55</td>
		<td>$phptotal55</td>
		<td><font color='blue'><b>$totaltime55</b></font></td>
		<td><font color='blue'><b>$phpperformanceindex55</b></font></td>
		<td><font color='blue'><b>$mysqlperformanceindex55</b></font></td>
		</tr>";
	echo "<tr><td>Wednesday 28nd October 2015 09:38:12</td>
		<td>MyWebToNet PHP 7.0 server</td>
		<td>81.7.161.171</td><td>7.0RC5</td>
		<td>5.6.15</td>
		<td>$mysqltotal70</td>
		<td>$phptotal70</td>
		<td><font color='blue'><b>$totaltime70</b></font></td>
		<td><font color='blue'><b>$phpperformanceindex70</b></font></td>
		<td><font color='blue'><b>$mysqlperformanceindex70</b></font></td>
		</tr>";
	
	
	$getdata = $wpdb->get_results("select sum(mysql1+mysql2+mysql3+queryresult) as mysqlresult,sum(php1+php2+php3+php4) as phpresult,uniqid, servername, serveraddr, memorylimit,phpversion,postmaxsize,mysqlversion,phpos,serverloadnow,serverload5,serverload15,mysql1,mysql2,mysql3,php1,php2,php3,php4,deleteable,DATE_FORMAT(dt, '%W %D %M %Y %T') as tt,phpuname from $tableprefix group by uniqid order by dt asc;");
	foreach ( $getdata as $getdata ) {
		echo "<tr><td valign='top'>".$getdata->tt."</td>
		<td valign='top'><a href='http://".$getdata->servername."' target=_blank>".$getdata->servername."</a></td>
		<td valign='top'>".$getdata->serveraddr."</td><td valign='top'>".$getdata->phpversion."</td>
		<td valign='top'>".$getdata->mysqlversion."</td><td valign='top'>".$getdata->mysqlresult."</td>
		<td valign='top'>".$getdata->phpresult."</td><td valign='top'><font color='blue'><b>";
		echo sprintf("%10.2f",$getdata->phpresult+$getdata->mysqlresult); 
		echo "</td><td valign='top'><font color='blue'><b>"; echo sprintf("%10.0f",10000/($getdata->phpresult)); echo "</b></font></td>";
		echo "<td valign='top'><font color='blue'><b>"; echo sprintf("%10.0f",10000/($getdata->mysqlresult/3)); echo "</b></font></td></tr>";
	}
	?>
	</table>	
	<?php
}


function mywebtonetperftest_createtable() {
	global $wpdb;
	$tableprefix = $wpdb->prefix."mywebtonetperfstatsresults";
	
	// $altertable = $wpdb->query("ALTER TABLE $tableprefix add queryresult decimal(10,2) NOT NULL DEFAULT '0.00'");
	// $altertable = $wpdb->query("ALTER TABLE $tableprefix add networktest decimal(10,2) NOT NULL DEFAULT '0.00'");
	// $altertable = $wpdb->query("ALTER TABLE $tableprefix add apacheversion varchar(100) NOT NULL DEFAULT ''");
	// $altertable = $wpdb->query("ALTER TABLE $tableprefix add uploadmaxsize varchar(10) NOT NULL DEFAULT ''");
	// $altertable = $wpdb->query("ALTER TABLE $tableprefix add maxexectime int NOT NULL DEFAULT '0'");
	
	
	$createtable = $wpdb->query( "
	CREATE TABLE if not exists `$tableprefix` (
	  `uniqid` bigint(20) NOT NULL auto_increment,
	  `servername` varchar(100) NOT NULL DEFAULT '',
	  `serveraddr` varchar(15) NOT NULL DEFAULT '',
	  `phpversion` varchar(50) NOT NULL DEFAULT '',
	  `phpuname` varchar(50) NOT NULL DEFAULT '',
	  `memorylimit` varchar(10) NOT NULL DEFAULT '',
	  `postmaxsize` varchar(10) NOT NULL DEFAULT '',
	  `mysqlversion` varchar(50) NOT NULL DEFAULT '',
	  `phpos` varchar(50) NOT NULL DEFAULT '',
	  `serverloadnow` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `serverload5` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `serverload15` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `queryresult` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `mysql1` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `mysql2` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `mysql3` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `php1` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `php2` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `php3` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `php4` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `networktest` decimal(10,2) NOT NULL DEFAULT '0.00',
	  `apacheversion` varchar(100) NOT NULL DEFAULT '',
	  `uploadmaxsize` varchar(10) NOT NULL DEFAULT '',
	  `maxexectime` int NOT NULL DEFAULT '0',
	  `deleteable` int(11) NOT NULL default '1',
	  `dt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	   UNIQUE KEY `uniqid` (`uniqid`),
	   KEY `servername` (`servername`)
	) ENGINE=MyISAM DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
	 ");	
}

function mywebtonetperftest_cleandb() {
	global $wpdb;
	$tableprefix = $wpdb->prefix."mywebtonetperfstatsresults";
	$createtable = $wpdb->query( "delete from `$tableprefix` where deleteable=1");
	echo "<center><H4>Database is now cleaned</h4>";
	exit;
}

function mywebtonetperftest_slow() {
	mywebtonetperftest_showfromdb("slow");
}

function mywebtonetperftest_fast() {
	mywebtonetperftest_showfromdb("fast");
}

function mywebtonetperftest_plugin_menu() {
	add_menu_page('mywebtonetperftest_plugin_all', 'Performance test', 'manage_options', 'mywebtonetperftest_plugin_all','mywebtonetperftest_plugin_all');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Show PHP/MySQL information','myweb-menu'),__('Show PHP/MySQL information','myweb-menu'), 'manage_options', 'sub-page1', 'ShowVersionInfo');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Do PHP Tests only','myweb-menu'),__('Do PHP Tests only','myweb-menu'), 'manage_options', 'sub-page2', 'DoPHPTests');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Do MySQL Tests only','myweb-menu'),__('Do MySQL Tests only','myweb-menu'), 'manage_options', 'sub-page3', 'JustMySQL');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Show fastest time','myweb-menu'),__('Show fastest time','myweb-menu'), 'manage_options', 'sub-page4', 'mywebtonetperftest_fast');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Show slowest time','myweb-menu'),__('Show slowest time','myweb-menu'), 'manage_options', 'sub-page5', 'mywebtonetperftest_slow');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Show list of tests','myweb-menu'),__('Show list of tests','myweb-menu'), 'manage_options', 'sub-page6', 'mywebtonetperftest_showlist');
  	add_submenu_page('mywebtonetperftest_plugin_all', __('Delete all results','myweb-menu'),__('Delete all results','myweb-menu'), 'manage_options', 'sub-page7', 'mywebtonetperftest_cleandb');
}


function mywebtonetperftest_plugin_all() {
	global $wpdb;
	global $mysqltests;
	global $MySQLtotaltime;
	global $PHPtotaltime;
	global $testmathresult;
	global $teststringresult;
	global $testloopresult;
	global $testifelseresult;
	global $mysqltemp;
	global $mysqlresults;
	global $ourdatamysql70;
	global $ourdataphp70;
	global $headertext;
	global $servername;		
	global $serveraddr;
	global $mysqlversion;
	global $phpversion;

	global $apacheversion;
	global $uploadmaxsize;
	global $maxexectime;
	global $phpuname;
	global $load;

	global $phpos;
        global $memorylimit;
        global $postmaxsize;


	echo "<center>Compare with results below, <a href='#footer'><b>click to view</b></a></center><br><br>\n";
	ShowVersionInfo();

        DoHeader();
	$queryresult = DoQueryTest();
	$MySQLtotaltime = $queryresult;
        DoMySQL();
        DoPHPTests();
	$networktest = test_Network();

	mywebtonetperftest_createtable();
	$tableprefix = $wpdb->prefix."mywebtonetperfstatsresults";
	$phpuname = addslashes($phpuname);
	$storeresults = $wpdb->query("insert into $tableprefix (servername,serveraddr,phpversion,memorylimit,postmaxsize,mysqlversion,phpos,serverloadnow,serverload5,serverload15,mysql1,mysql2,mysql3,php1,php2,php3,php4,phpuname,queryresult,networktest,apacheversion,uploadmaxsize,maxexectime) values ('$servername','$serveraddr','$phpversion','$memorylimit','$postmaxsize','$mysqlversion','$phpos','$load[0]','$load[1]','$load[2]','$mysqlresults[0]','$mysqlresults[1]','$mysqlresults[2]','$testmathresult','$teststringresult','$testloopresult','$testifelseresult','$phpuname','$queryresult','$networktest','$apacheversion','$uploadmaxsize','$maxexectime');");
        
	echo "<table width=70%>\n";
	echo "<tr><td valign='top'><b>All tests:</b></td></tr>\n";
	echo "<tr><td valign='top' width=20%>Total time</td><td valign='top' width=58%><b>(all MySQL + PHP tests)</td><td valign='top' width=22%> :<font color='blue'><b>".sprintf("%6.2f",$PHPtotaltime+$MySQLtotaltime)."</b></font> seconds</td></tr></table>\n";	
	$md5time = md5(time().$servername);
	?>
	<center>
	<br>
	<table width='95%' cellpadding=2 cellspacing=6 style='background: #FFFFFF;border-radius:5px;-moz-border-radius:5px;-webkit-border-radius:5px;border: 2px solid #cccccc;'>
	<tr><td valign='top' align='left'>
	By submitting results we can evaluate figures and compare one test to the other. No tests will ever get disclosed. If you <b>do not want</b> this information to be submitted, please do <b>not</B> press the submit button.
	</td></tr></table>
	<br>
	<FORM name="myform" METHOD="POST" ACTION="http://gather.webhosting.dk/cgi-bin/mywebtonet-performancestatsresults.pl" accept-charset="ISO-8859-1" target=_blank>
	<input type='hidden' name='md5time' value='<?php echo $md5time ?>'>
	<input type='hidden' name='servername' value='<?php echo $servername ?>'>
	<input type='hidden' name='serveraddr' value='<?php echo $serveraddr ?>'>
	<input type='hidden' name='phpversion' value='<?php echo $phpversion ?>'>
	<input type='hidden' name='phpos' value='<?php echo $phpos ?>'>
	<input type='hidden' name='mathresult' value='<?php echo $testmathresult ?>'>
	<input type='hidden' name='stringresult' value='<?php echo $teststringresult ?>'>
	<input type='hidden' name='testloopresult' value='<?php echo $testloopresult ?>'>
	<input type='hidden' name='ifelseresult' value='<?php echo $testifelseresult ?>'>
	<input type='hidden' name='queryresult' value='<?php echo $queryresult ?>'>
	<input type='hidden' name='mysqlresults' value='<?php echo $mysqltemp ?>'>
	<input type='hidden' name='phpmemorylimit' value='<?php echo $memorylimit ?>'>
	<input type='hidden' name='postmaxsize' value='<?php echo $postmaxsize ?>'>
	<input type='hidden' name='phpuname' value='<?php echo $phpuname ?>'>
	<input type='hidden' name='loadnow' value='<?php echo $load[0] ?>'>
	<input type='hidden' name='load5' value='<?php echo $load[1] ?>'>
	<input type='hidden' name='load15' value='<?php echo $load[2] ?>'>
	<input type='hidden' name='networktest' value='<?php echo $networktest ?>'>
	<input type='hidden' name='mysqlversion' value='<?php echo $mysqlversion ?>'>
	<input type='hidden' name='apacheversion' value='<?php echo $apacheversion ?>'>
	<input type='hidden' name='uploadmaxsize' value='<?php echo $uploadmaxsize ?>'>
	<input type='hidden' name='maxexectime' value='<?php echo $maxexectime ?>'>
	<font face="Verdana,Arial" size="1"><INPUT TYPE=submit VALUE="Submit results">
	</form>
	<br><br><table cellpadding=0 cellspacing=0 style='background: #FFFFFF;border-radius:10px;-moz-border-radius:10px;-webkit-border-radius:10px;border: 2px solid #cccccc;'>
	<?php
		$datamysql = array("Query result" => $queryresult,"MySQL 1" => $mysqlresults[0],"MySQL 2" => $mysqlresults[1],"MySQL 3" => $mysqlresults[2]);	
		$dataphp = array("Mathresult" => $testmathresult,"StringManipulation " => $teststringresult,"Loop" => $testloopresult,"IfElse" => $testifelseresult);	
	?>
		<?php if ($phpmajorversion<8) { ?>	
		<td valign='top' align='left'>
			<table>
			<tr>
			<td><img src="<?php echo MYWEB_URL; ?>showgraphpie.php?showsmall=0&header=<?php echo urlencode(serialize("MySQL results")); ?>&mydata=<?php echo urlencode(serialize($datamysql)); ?>" /></td>
			<td><img src="<?php echo MYWEB_URL; ?>showgraphpie.php?showsmall=0&header=<?php echo urlencode(serialize("PHP results")); ?>&mydata=<?php echo urlencode(serialize($dataphp)); ?>" /></td>
			<br>
			</tr>
			<tr>	
			<td><img src="<?php echo MYWEB_URL; ?>showgraph.php?showsmall=0&header=<?php echo urlencode(serialize("Lower is better, Our server=Green, Your server=Blue")); ?>&mywebdata=<?php echo urlencode(serialize($ourdatamysql70));?>&mydata=<?php echo urlencode(serialize($datamysql)); ?>" /></td>
			<td><img src="<?php echo MYWEB_URL; ?>showgraph.php?showsmall=0&header=<?php echo urlencode(serialize("Lower is better, Our server=Green, Your server=Blue")); ?>&mywebdata=<?php echo urlencode(serialize($ourdataphp70)); ?>&mydata=<?php echo urlencode(serialize($dataphp)); ?>" /></td>
			</tr>	
			</table>		
		</td>
		<?php } ?>
	</table><br>		
	<?php
	ShowFooter();
}

function ShowVersionInfo() {
	global $wpdb;
	global $mysqltests;
	global $MySQLtotaltime;
	global $PHPtotaltime;
	global $testmathresult;
	global $teststringresult;
	global $testloopresult;
	global $testifelseresult;
	global $mysqltemp;
	global $mysqlresults;
	global $ourdatamysql70;
	global $ourdataphp70;
	global $headertext;
	global $servername;		
	global $serveraddr;
	global $phpversion;
	global $mysqlversion;

	global $apacheversion;
        global $uploadmaxsize;
        global $maxexectime;
        global $phpuname;
        global $load;

	global $phpos;
	global $memorylimit;
	global $postmaxsize;



	$getcwdpath	= getcwd();
	$servermode	= $_SERVER['GATEWAY_INTERFACE'];
	
	
	$servername	= $_SERVER['SERVER_NAME'];
	$serveraddr	= $_SERVER['SERVER_ADDR'];
	$phpversion	= PHP_VERSION;
	$phpmajorversion= PHP_MAJOR_VERSION;

	$phpos		= PHP_OS;
	$phpuname	= php_uname();
	$memorylimit 	= ini_get("memory_limit");
	$postmaxsize 	= ini_get("post_max_size");
	$uploadmaxsize 	= ini_get("upload_max_filesize");
	$mysqlversion 	= $wpdb->get_var( "select version();" );
	$maxexectime	= ini_get('max_execution_time');
	$phpinilocation	= php_ini_loaded_file();
	$apacheversion = (function_exists('apache_get_version')) ? apache_get_version() : ''; 
	if ($apacheversion == "") {
		$apacheversion 	= "Test not implemented yet/unknown web server";
	}

	$loadedmodules = (function_exists('apache_get_modules')) ? apache_get_modules() : ''; 
	if ($loadedmodules == "") {
		$loadedmodules 	= "Test not implemented yet";
	}



	?>
	<table width='95%'><tr><td width='40%'></td><td width='20%'><h3><?php echo $headertext ?></h3></td><td width='40%' align='right'><a href='http://www.mywebtonet.com' target=_blank><img src="<?php echo MYWEB_URL; ?>mywebtonetlogo.png" border=0></a></td></tr></table>	
	<?php
        echo "<table>\n";
        echo "<tr><td valign='top'>Server:</td><td><font color='blue'><b>$servername@<font color='blue'><b>".$serveraddr."</b></font></td></tr>\n";
        echo "<tr><td valign='top'>PHP host information:</td><td><font color='blue'><b>".$phpuname."</b></font></td></tr>\n";   
        echo "<tr><td valign='top'>PHP version:</td><td><font color='blue'><b>".$phpversion."</B></font></td></tr>\n";
	echo "<tr><td valign='top'>PHP memory limit:</td><td><font color='blue'><b>".$memorylimit."</b></font></td></tr>\n";
	echo "<tr><td valign='top'>PHP post_max_size:</td><td><font color='blue'><b>".$postmaxsize."</b></font></td></tr>\n";
	echo "<tr><td valign='top'>PHP upload_max_size:</td><td><font color='blue'><b>".$uploadmaxsize."</b></font></td></tr>\n";
	echo "<tr><td valign='top'>PHP max_execution_time:</td><td><font color='blue'><b>".$maxexectime."</b> seconds</font></td></tr>\n";
	echo "<tr><td valign='top' align='left'>PHP extensions loaded</td><td valign='top' align='left'><font color='blue'><B>\n";
  	$extensions = get_loaded_extensions();
	foreach($extensions as $key => $value) {
 	 echo $value." ";
	}
	echo "</b></td></tr>\n";

	echo "<tr><td valign='top'>PHP ini file location:</td><td><font color='blue'><b>".$phpinilocation."</b></font></td></tr>\n";
	if ($apacheversion != "") {
		echo "<tr><td valign='top'>Webserver:</td><td><font color='blue'><b>".$apacheversion."</b></font></td></tr>\n";
	}
	if ($loadedmodules != "") {
		echo "<tr><td valign='top'>Loaded webserver modules:</td><td style='word-wrap:'><font color='blue'><b>";
		$arrlength=count($loadedmodules);
		for($x=0;$x<$arrlength;$x++)
		  {
		    echo $loadedmodules[$x]." ";
		  }  	
		  echo "</td></tr>\n";
	}
        echo "<tr><td valign='top'>Platform:</td><td><font color='blue'><b>".$phpos."</b></font></td></tr>\n";

        echo "<tr><td valign='top'>Gateway interface:</td><td><font color='blue'><b>".$servermode."</b></font></td></tr>\n";
        echo "<tr><td valign='top'>Path to files:</td><td><font color='blue'><b>".$getcwdpath."</b></font></td></tr>\n";


        echo "<tr><td valign='top'>MySQL version</td><td><font color='blue'><b>".$mysqlversion."</font></b></td></tr>";
	/*
	 Windows shouldn't give us the load average
	*/	
	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		echo "<tr><td valign='top'>Server load now:</td><td valign='top' align='right'><b>Unable to fetch load as windows is used for webserver (incompatible)</b></td></tr>\n";
	} else {
		$load= sys_getloadavg();
		echo "<tr><td valign='top'>Server load now:</td><td valign='top' align='left'><font color='blue'><b>".sprintf("%6.2f",$load[0])."</b></td></tr>\n";
		echo "<tr><td valign='top'>Server load avg. 5 minutes:</td><td valign='top' align='left'><font color='blue'><b>".sprintf("%6.2f",$load[1])."</b></td></tr>\n";
		echo "<tr><td valign='top'>Server load avg. 15 minutes:</td><td valign='top' align='left'><font color='blue'><b>".sprintf("%6.2f",$load[2])."</b></td></tr>\n";	
	}	
        echo "</table>\n";
}



function ShowFooter() {
	echo "<a name='footer'>Some PHP 5.3, 5.4 and 5.5 examples below (<b>click on images below to view</b>):";
	?>
	<br><br>	
	<a href="<?php echo MYWEB_URL; ?>perftestphp53.png" target=_blank><img src="<?php echo MYWEB_URL; ?>perftestphp53.png" width=326 height=228 alt="PHP 5.3 test result" border=0></a>
	<a href="<?php echo MYWEB_URL; ?>perftestphp54.png" target=_blank><img src="<?php echo MYWEB_URL; ?>perftestphp54.png" width=326 height=228 alt="PHP 5.4 test result" border=0></a>
	<a href="<?php echo MYWEB_URL; ?>perftestphp55.png" target=_blank><img src="<?php echo MYWEB_URL; ?>perftestphp55.png" width=326 height=228 alt="PHP 5.5 test result" border=0></a>
	<br><br>
	</center>
	Plugin URL <a href='http://wordpress.org/plugins/mywebtonet-performancestats/' target=_blank><b>http://wordpress.org/plugins/mywebtonet-performancestats/</b></a>
	<br><br>
	Script made by <a href='http://www.mywebtonet.com' target=_blank><b>http://www.mywebtonet.com</b></a>&nbsp;&nbsp;<a href='http://www.webhosting.dk' target=_blank><b>http://www.webhosting.dk</b></a>
<?php
}

function DoHeader() {
	?>
	<body onLoad="init()">
	<div id="loading" style="width:40%; text-align:center; margin-left:auto; margin-right:auto; margintop:10px; background-color: #5c87b2;">
	<br><br><br><img src="<?php echo MYWEB_URL.'pleasewait.gif'; ?>" alt="">
	<center><br><br><font face='Verdana,Arial'>Please wait while we perform some tests!
	</div><script>
	var ld=(document.all);
	var ns4=document.layers;
	var ns6=document.getElementById&&!document.all;
	var ie4=document.all;
         if (ns4)
         	ld=document.loading;
                  else if (ns6)
                  	ld=document.getElementById("loading").style;
                         else if (ie4)
                   ld=document.all.loading.style;
             function init()
                      {
                       if(ns4){ld.visibility="hidden";}
			else if (ns6||ie4) ld.display="none";
		}
	</script>
	</center>
	<?php
	flush();
}

function DoPHPTests() {
	global $PHPtotaltime;
	global $testmathresult;
	global $teststringresult;
	global $testloopresult;
	global $testifelseresult;

        echo "<table width=70%>\n";
	echo "<tr><td valign='top'><B>PHP test:</b></td></tr>\n";
	$PHPtotaltime =0;
	$testmathresult = test_Math();
	$PHPtotaltime = $PHPtotaltime + $testmathresult;
	echo "<tr><td valign='top' width=20%>Time to perform: </td><td valign='top' width=58%><font color='blue'><b> Math test</b></font></td><td valign='top' width=22%> :".sprintf("%6.2f",$testmathresult)." seconds</td></tr>\n";	
	//
	$teststringresult = test_StringManipulation();
	$PHPtotaltime = $PHPtotaltime + $teststringresult;
	
	echo "<tr><td valign='top'>Time to perform: </td><td valign='top'><font color='blue'><b> StringManipulation test</b></font></td><td valign='top'> :".sprintf("%6.2f",$teststringresult)." seconds</td></tr>\n";	
	//
	$testloopresult = test_Loops();
	$PHPtotaltime = $PHPtotaltime + $testloopresult;
	echo "<tr><td valign='top'>Time to perform: </td><td valign='top'><font color='blue'><b> test Loop test</b></font></td><td valign='top'> :".sprintf("%6.2f",$testloopresult)." seconds</td></tr>\n";	
	//
	$testifelseresult =  test_IfElse();
	$PHPtotaltime = $PHPtotaltime + $testifelseresult;
	echo "<tr><td valign='top'>Time to perform: </td><td valign='top'><font color='blue'><b>  test IfElse</b></font></td><td valign='top'> :".sprintf("%6.2f",$testifelseresult)." seconds</td></tr>\n";	
	echo "<tr><td valign='top'>Total time</td><td valign='top'><b>(all PHP tests)</td><td valign='top'> :<font color='blue'><b>".sprintf("%6.2f",$PHPtotaltime)."</b></font> seconds</td></tr></table>\n";	

}

function JustMySQL() {
	DoQueryTest();
	DoMySQL();
	
}

function DoMySQL() {
	global $wpdb;
	global $mysqltests;
	global $MySQLtotaltime;
	global $mysqltemp;
	global $mysqlresults;
	global $queryresults;
	$tableprefix = $wpdb->prefix."mywebtonetperfstatsresults";
	$count = count($mysqltests);
 	echo "<table width=70%>\n";
        echo "<tr><td valign='top'><B>MySQL tests:</b></td></tr>\n";


	for ($i = 0; $i < $count; $i++) {
		$time_start = microtime(true);
		$dotest = $wpdb->query( "$mysqltests[$i]" );	
		$result = sprintf("%10.2f",number_format(microtime(true) - $time_start, 3));	
		if ($result < 0.02) {
				//
				// trigger MySQL error, something is wrong..., noone has a result less than 0.02, so the MySQL server probably crashed
				//	
				$mysqlerror = 1;
				$result     = 99.99;			
		}	
		$mysqlresults[]=$result;
		$MySQLtotaltime = $MySQLtotaltime + $result;
		echo "<tr><td valign='top' width=20%>Time to perform: </td><td valign='top' width=58%><font color='blue'><b>$mysqltests[$i]</b></font></td><td valign='top' width=22%> :".sprintf("%6.2f",$result)." seconds</td></tr>\n";	
		flush();
	}
	$count = count($mysqlresults);
	for ($i = 0; $i < $count; $i++) {
		$mysqltemp = $mysqltemp.",".$mysqlresults[$i];
	}	
	if ( ! isset( $mysqlerror ) ) {
		echo "<tr><td valign='top'>Total time</td><td valign='top'><b>(all MySQL tests)</b></td><td valign='top'> :<font color='blue'><b>".sprintf("%6.2f",$MySQLtotaltime)."</b></font> seconds</td></tr></table>\n";	
	} else {
		$MySQLtotaltime = 99.99;
		echo "<tr><td valign='top'>Total time</td><td valign='top'><b>(all MySQL tests)</b></td><td valign='top'> :<font color='blue'><b>MySQL test error</b></font></td></tr></table>\n";	
	}		

}

function DoQuerytest() {
	global $wpdb;
	global $mysqlquerydata;
	global $runquerycount;
	//
	$tableprefix = $wpdb->prefix."mywebtonetqtest";
	$createtable = $wpdb->query("CREATE TABLE if not exists `$tableprefix` (`dummydata` text NOT NULL DEFAULT '')");
	$time_start = microtime(true);
	echo "<table width=70%>\n";
	echo "<tr><td valign='top'><b>MySQL test: </b></td></tr>\n";
	for ($i = 0; $i < $runquerycount ; $i++) {
		$dotest = $wpdb->query( "insert into $tableprefix (dummydata) values ('$mysqlquerydata');" );	
		$dotest = $wpdb->query( "select * from $tableprefix;" );	
		$dotest = $wpdb->query( "update $tableprefix set dummydata='';" );	
		$dotest = $wpdb->query( "delete from $tableprefix;" );	
	}
	$result = sprintf("%10.2f",number_format(microtime(true) - $time_start, 3));	
	$cresult = sprintf("%0.0f",$runquerycount /$result);
	echo "<tr><td valign='top' width=20%>Time to perform: </td><td valign='top' width=58%><font color='blue'><b>Query test ($runquerycount times)</b></font></td><td valign='top' width=22%> :".sprintf("%6.2f",$result)." seconds (<b>$cresult/sec</b>)</td></tr>\n";	
	return $result;
}



function test_Math($count = 50000) {
	$time_start = microtime(true);
	$mathFunctions = array("abs", "acos", "asin", "atan", "bindec", "floor", "exp", "sin", "tan", "pi", "is_finite", "is_nan", "sqrt");
	foreach ($mathFunctions as $key => $function) {
		if (!function_exists($function)) unset($mathFunctions[$key]);
	}
	for ($i=0; $i < $count; $i++) {
		foreach ($mathFunctions as $function) {
			$r = call_user_func_array($function, array($i));
		}
	}
	return sprintf("%10.2f",number_format(microtime(true) - $time_start, 3));
}
	
	
function test_StringManipulation($count = 100000) {
	$time_start = microtime(true);
	$stringFunctions = array("addslashes", "chunk_split", "metaphone", "strip_tags", "md5", "sha1", "strtoupper", "strtolower", "strrev", "strlen", "soundex", "ord");
	foreach ($stringFunctions as $key => $function) {
		if (!function_exists($function)) unset($stringFunctions[$key]);
	}
	$string = "the quick brown fox jumps over the lazy dog";
	for ($i=0; $i < $count; $i++) {
		foreach ($stringFunctions as $function) {
			$r = call_user_func_array($function, array($string));
		}
	}
	return sprintf("%10.2f",number_format(microtime(true) - $time_start, 3));
}


function test_Network() {
	/*
	* get hostnames in DNS cache
	*/
	
	$testurl = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js";
	
	$time_start = microtime(true);
        $dummy = wp_remote_get($testurl);
        // Check for error
	if ( is_wp_error( $dummy ) ) {
		return;
	}
	$data = wp_remote_retrieve_body( $dummy );
        $dummy = wp_remote_get($testurl); $data .= wp_remote_retrieve_body( $dummy );
        $dummy = wp_remote_get($testurl); $data .= wp_remote_retrieve_body( $dummy );
        $dummy = wp_remote_get($testurl); $data .= wp_remote_retrieve_body( $dummy );
        $dummy = wp_remote_get($testurl); $data .= wp_remote_retrieve_body( $dummy );
        $dummy = wp_remote_get($testurl); $data .= wp_remote_retrieve_body( $dummy );

	$time_end = microtime(true) - $time_start;
	$lenfile = strlen($data);
	$mbps = sprintf('%.2f', (($lenfile * 8) / 1024 / 1024) / $time_end);
	/*	
	* again, up against our servers in Europe
	*/
//	$whtime_start = microtime(true);
//	$dummy = wp_remote_get('http://static.webhosting.dk/1mbfile');
//	$whdata = wp_remote_retrieve_body( $dummy );
//    	$whtime_end = microtime(true) - $whtime_start;
//	$whlenfile = strlen($whdata);
//	$whmbps = sprintf('%.2f', (($whlenfile * 8) / 1024 / 1024) / $whtime_end);
	
        echo "<table width=70%>\n";
	echo "<tr><td valign='top'><B>Network test:</b></td></tr>\n";
	echo "<tr><td valign='top' width=20%>Network test 1: </td><td valign='top' width=58%><font color='blue'><b>Fetch data from nearest google CDN point</b></font></td><td valign='top' width=22%>:<font color='blue'><b> $mbps</b></font> Mbps</td></tr>\n";	
//	echo "<tr><td valign='top' width=20%>Network test 2: </td><td valign='top' width=58%><font color='blue'><b>Fetch data from our servers in Europe at http://www.mywebtonet.com</b></font></td><td valign='top' width=22%>:<font color='blue'><b> $whmbps</b></font> Mbps</td></tr>\n";
	echo "</table>\n";
	$xresult = sprintf("%.2f",$mbps+$whmbps);
	return $xresult;
}


function test_Loops($count = 10000000) {
	$time_start = microtime(true);
	for($i = 0; $i < $count; ++$i);
	$i = 0; while($i < $count) ++$i;
	return sprintf("%10.2f",number_format(microtime(true) - $time_start, 3));
}

	
function test_IfElse($count = 10000000) {
	$time_start = microtime(true);
	for ($i=0; $i < $count; $i++) {
		if ($i == -1) {
		} elseif ($i == -2) {
		} else if ($i == -3) {
		}
	}
	return sprintf("%10.2f",number_format(microtime(true) - $time_start, 3));
}	
?>