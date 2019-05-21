import React from 'react';
import './App.scss';

import SdkMap from '@boundlessgeo/sdk/components/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import { getLayerById } from '@boundlessgeo/sdk/util';
import { connect } from 'react-redux';

import Slider from '@material-ui/lab/Slider';

class App extends React.Component {
	componentDidMount() {
		// add the OSM source
		this.props.addOsmSource('osm');
		this.props.addLayer({
			id: 'osm',
			source: 'osm'
		});

		this.props.setView(
			[
				-80,
				40
			],
			3
		);

		this.props.addSource('population', {
			type: 'raster',
			tileSize: 256,
			maxzoom: 15,
			tiles: [
				'https://demo.geo-solutions.it/geoserver/topp/wms?service=WMS&version=1.1.0&request=GetMap&layers=topp:states&srs=EPSG:4326&format=image%2Fpng'
			]
		});
		this.props.addLayer({
			id: 'population',
			source: 'population',
			type: 'raster',
			paint: {
				'raster-opacity': 0.3
			}
		});
	}
	updateOpacity(opacity, layer) {
		this.props.updateLayer('population', {
			paint: Object.assign({}, layer.paint, {
				'raster-opacity': opacity / 100
			})
		});
	}

	render() {
		let layer = '';
		let opacity = 30;
		const layers = this.props.map.layers;
		if (layers.length > 0) {
			layer = getLayerById(layers, 'population');
			opacity = layer.paint['raster-opacity'] * 100;
		}
		return (
			<div className="App">
				<SdkMap className="map" />

				<Slider
					value={opacity}
					className="opacitySlide"
					step={1}
					aria-labelledby="label"
					onChange={(event, value) => this.updateOpacity(value, layer)}
				/>
			</div>
		);
	}
}
const mapStateToProps = (state) => ({
	map: state.map,
	layer: state.map.layer
});
const mapDispatchToProps = (dispatch) => ({
	updateLayer: (layerName, paintObj) => {
		dispatch(SdkMapActions.updateLayer(layerName, paintObj));
	},
	addLayer: (LayerObj) => {
		dispatch(SdkMapActions.addLayer(LayerObj));
	},
	addSource: (sourceName, SourceObj) => {
		dispatch(SdkMapActions.addSource(sourceName, SourceObj));
	},
	setView: (center, zoom) => {
		dispatch(SdkMapActions.setView(center, zoom));
	},
	addOsmSource: (sourceName) => {
		dispatch(SdkMapActions.addOsmSource(sourceName));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
