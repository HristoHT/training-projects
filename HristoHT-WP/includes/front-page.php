<?php 
    global $wpdb;
    $table_name = $wpdb->prefix . "markers2";
    $db_results = $wpdb->get_results("SELECT * FROM $table_name");

    if(isset($_POST['body'])){
        echo $_POST['body'];
    }
?>
<form method="post">
    <div style="width:30%;display:inline-block;">
        <label for="lon">Longtitude</label>
        <input type="text" id="lon" name="lon">
    </div>

    <div style="width:30%;display:inline-block;">
        <label for="lat">Latitude</label>
        <input type="text" id="lat" name="lat">
    </div>

    <div style="width:15%;display:inline-block;">
        <button type="submit" name="add">Add</button>
    </div>

</form>
<br/>
<form method="post">
    <div style="width:30%;display:inline-block;">
        <label for="count">Count</label>
        <input type="text" id="count" name="count" value="5">
    </div>
    <div style="width:30%;display:inline-block;">
        <button type="submit" name="generate">Generate</button>
    </div>
</form>
<br/>
<form method="post">
    <div style="width:30%;display:inline-block;">
        <button type="submit" id="quakes" name="quakes">Earthquakes</button>
    </div>
    <div style="width:30%;display:inline-block;">
        <label for="auto">Auto</label>
        <button id="auto" name="auto">Start</button>
    </div>
</form>
<div style="width:500px;height:400px;overflow-Y:auto;">

    <table style="width:500px;height:400px;">
        <tr>
            <th>Id</th>
            <th>Longtitude</th>
            <th>Latitude</th>
            <th>Place</th>
            <th>Magnitude</th>
            <th>Time</th>
        </tr>
        <?php foreach($db_results as $row) { ?>
            <tr>
                <th><?php echo $row->id ?></th>
                <th><?php echo $row->lon ?></th>
                <th><?php echo $row->lat ?></th>
                <th><?php echo $row->place ?></th>
                <th><?php echo $row->mag ?></th>
                <th><?php echo $row->tm ?></th>
            </tr>
        <?php } ?> 
    </table>

</div>
<script>
    window.eqfeed_callback = async function(results) {
        try{
        // console.log(JSON.parse(JSON.stringify(results)));
        console.log('In');
        const response = await fetch('../wp-content/plugins/google-map/save-markers.php', {
                method: "POST",
                body: JSON.stringify(results)
            });

            const result = await response.json();
            console.log(result);
            console.log(response);
        }catch(e){
            console.log(e.stack)
        }
    }

    var bool = true, interval;
    document.getElementById('auto').onclick = (e) => {
        e.preventDefault();
        if(bool){
            interval = setInterval(() => {
                var src = document.createElement('script');
                src.setAttribute('src','http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp');
                document.head.appendChild(src);
            }, 10000);

            bool = false;
            e.target.innerHTML = 'Stop';
        } else {
            clearInterval(interval);
            bool = true;
            e.target.innerHTML = 'Start';
        }
    }
</script>

<?php
    function get_earthquakes(){
        if(isset($_POST['quakes'])){
            echo "<script src='http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp'></script>";
        }
    }

    function rand_float($st_num=0,$end_num=1,$mul=1000000) {
        if ($st_num>$end_num) return false;
        return mt_rand($st_num*$mul,$end_num*$mul)/$mul;
    }

    function generate_markers(){
        global $wpdb;
        $table_name = $wpdb->prefix . "markers2";
        //$results = $wpdb->get_results("SELECT * FROM $table_name");
       
        $count = $_POST['count'];
        $range = 180;
        if(isset($_POST['generate']) && $count){
            $insertArr = array();
    
            for ( $i = 0; $i < $count; $i++ ) {
                $lon = rand_float(-$range, $range); 
                $lat = rand_float(-$range, $range);
                $insertArr[] = $wpdb->prepare( "(%d,%d)", $lon, $lat );
            }

            $query = "INSERT INTO $table_name (lon, lat) VALUES ";
            $query .= implode( ",\n", $insertArr );

            $wpdb->query($query);
        }
    }


    function add_marker(){
        global $wpdb;
        $table_name = $wpdb->prefix . "markers2";
        //$results = $wpdb->get_results("SELECT * FROM $table_name");

        $lon = $_POST['lon'];
        $lat = $_POST['lat'];

        if(isset($_POST['add']) && $lon && $lat){
            $wpdb->insert($table_name,
                        array(
                            'lon' => $lon,
                            'lat' => $lat
                        ),
                        array(
                            '%d',
                            '%d'
                        )
                    );
        }

    }

    // Method: POST, PUT, GET etc
// Data: array("param" => "value") ==> index.php?param=value

function CallAPI($method, $url, $data = false)
{
    $curl = curl_init();

    switch ($method)
    {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);

            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_PUT, 1);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    $result = curl_exec($curl);

    curl_close($curl);

    return $result;
}
