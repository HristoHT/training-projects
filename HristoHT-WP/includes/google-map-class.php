<?php
/**
 * Adds Google Map Widget widget.
 */
class Google_Map_Widget extends WP_Widget {

	/**
	 * Register widget with WordPress.
	 */
	function __construct() {
		parent::__construct(
			'google_map_widget', // Base ID
			esc_html__( 'Custom Google Map', 'gm_domain' ), // Name
			array( 'description' => esc_html__( 'Widget for google map', 'gm_domain' ), ) // Args
		);
	}

	/**
	 * Front-end display of widget.
	 *
	 * @see WP_Widget::widget()
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance Saved values from database.
	 */
	public function widget( $args, $instance ) {
        echo $args['before_widget'];
        
		if ( ! empty( $instance['title'] ) ) {
			echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
        }
                
		echo '
		<style>
        .options {
            width: 450px;
            height: auto;
            background-color: #e1e1e1;
			padding: 3px;
			font-size: 18px;
        }

        .options-button {
            width: 450px;
        }

        .options>.options-row {
            margin: 10px;
        }

        .options>.options-row>input {
            padding: 0px !important;
            width: 80px;
            float: right;
        }

        .options>.options-row label {
            /* Other styling... */
            clear: both;
            float: right;
            text-align: left;
            align-content: space-between !important;
        }

        input {
            padding: 0px !important;
            width: 80px !important;
        }

        p,
        input,
        label {
            display: inline-block !important;
        }

        .button {
            background-color: #fafafa;
			width: 80px;
			color: black;
			padding: 0px;
            cursor: pointer;
        }

        .button:hover{
            background-color: #e1e1e1;
			border: 1px solid #fafafa
        }

        #fromDate,
        #toDate {
            width: 120px !important;
        }
    </style>
    <div style="z-index: 100001;position: absolute; left:0;bottom:0">
        <div class="options">
            <div class="options-row">
                Дата:
                <label for="depth">
                    от <input type="date" id="fromDate">
                    до <input type="date" id="toDate">
                </label>
            </div>
            <div class="options-row">
                Магнитуд:
                <label for="magnitude">
                    от <input type="number" min="1" max="10" id="magnitudeMin">
                    до <input type="number" min="1" max="10" id="magnitudeMax">
                </label>
            </div>
            <div class="options-row">
                Дълбочина(m.):
                <label for="depth">
                    от <input type="number" min="1" max="1000" id="depthMin">
                    до <input type="number" min="1" max="1000" id="depthMax">
                </label>
            </div>

            <div class="options-row">
                Квадратна зона:<br/>
				<p>Координати на горен ляв ъгъл:
					<label style="text-align: center;">
						(<input type="number" id="topLeftX">
						,<input type="number" id="topLeftY">)
					</label>
				</p>
				<p>Координати на долен десен ъгъл:
					<label style="text-align: center;">
						(<input type="number" id="bottomRightX">,
						<input type="number" id="bottomRightY">)
					</label>
				</p>
            </div>
            <div class="options-button" style="text-align: center;margin: 10px;">
                <center>
                    <div class="button" id="button">
                        Go
                    </div>
                </center>
            </div>
        </div>
    </div>
		<div id="map" style="position:absolute!important; top:0; z-index:100000; width:100%;height:100%; left:0">1</div>';

		echo $args['after_widget'];
	}

	/**
	 * Back-end widget form.
	 *
	 * @see WP_Widget::form()
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( 'Google Map', 'gm_domain' );
		?>
        <!-- Title -->
		<p>
		    <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
            <?php esc_attr_e( 'Title:', 'gm_domain' ); ?>
            </label>

		    <input 
            class="widefat" 
            id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" 
            name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" 
            type="text" 
            value="<?php echo esc_attr( $title ); ?>">
		</p>
		<?php 
	}

	/**
	 * Sanitize widget form values as they are saved.
	 *
	 * @see WP_Widget::update()
	 *
	 * @param array $new_instance Values just sent to be saved.
	 * @param array $old_instance Previously saved values from database.
	 *
	 * @return array Updated safe values to be saved.
	 */
	public function update( $new_instance, $old_instance ) {
		$instance = array();
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? sanitize_text_field( $new_instance['title'] ) : '';

		return $instance;
	}

} // class Foo_Widget