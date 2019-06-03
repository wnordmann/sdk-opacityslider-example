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
				-122.835,
				53.84
			],
			13
		);

		const wfs_url =
			'https://openmaps.gov.bc.ca/geo/pub/WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW/wfs?version=1.1.0&REQUEST=GetFeature&SRSNAME=EPSG:3857&typeNames=pub:WHSE_CADASTRE.PMBC_PARCEL_FABRIC_POLY_SVW&OUTPUTFORMAT=JSON&BBOX=53.81735,-122.87679,53.8551,-122.81290,urn:ogc:def:crs:EPSG:4326';

		this.props.addSource('bc-parcels-wfs', {
			type: 'geojson',
			data: wfs_url
		});

		this.props.addLayer({
			id: 'bc-parcels-wfs',
			source: 'bc-parcels-wfs',
			type: 'fill',
			paint: {
				'fill-opacity': 0.4,
				'fill-color': '#0099ff',
				'fill-outline-color': '#0033cc'
			}
		});

		// this.props.addLayer({
		// 	id: 'bc-parcels-wfs2',
		// 	source: 'bc-parcels-wfs',
		// 	type: 'fill',
		// 	paint: {
		// 		'fill-opacity': 0.0
		// 	}
		// });
	}

	updateOpacity(opacity, layer) {
		this.props.updateLayer('bc-parcels-wfs', {
			paint: Object.assign({}, layer.paint, {
				'fill-opacity': opacity / 100
			})
		});
	}

	render() {
		let layer = '';
		let opacity = 30;
		const layers = this.props.map.layers;
		if (layers.length > 0) {
			layer = getLayerById(layers, 'bc-parcels-wfs');
			opacity = layer.paint['fill-opacity'] * 100;
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
