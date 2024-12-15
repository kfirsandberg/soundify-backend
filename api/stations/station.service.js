import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { makeId } from '../../services/util.service.js'

export const stationService = {
	remove,
	query,
	getById,
	add,
	update,
}

async function query(filterBy = { txt: '' }) {
	try {
		const collection = await dbService.getCollection('station')
		var stations = await collection.find().sort({ _id: -1 }).toArray() 
		return stations
	} catch (err) {
		logger.error('cannot find station', err)
		throw err
	}
}

async function getById(stationId) {
	try {
		console.log(stationId);
		
		const collection = await dbService.getCollection('station')
		const station = await collection.findOne({ _id: ObjectId.createFromHexString(stationId) })
		return station
	} catch (err) {
		logger.error(`while finding station ${stationId}`, err)
		throw err
	}
}

async function remove(stationId) {
	try {
		const collection = await dbService.getCollection('station')
		const { deletedCount } = await collection.deleteOne({ _id: ObjectId.createFromHexString(stationId) })
        return deletedCount
	} catch (err) {
		logger.error(`cannot remove station ${stationId}`, err)
		throw err
	}
}

async function add(station) {
	try {
		console.log(station)
		const collection = await dbService.getCollection('station')
		await collection.insertOne(station)
		return station
	} catch (err) {
		logger.error('cannot insert station', err)
		throw err
	}
}

async function update(station) {
	const stationTosave = { owner: station.owner, images: station.images ,collaborative : station.collaborative,name: station.name, followers: station.followers,description: station.description,tracks: station.tracks }
	try {
		///// id ih the params req , body = {update object}

		const criteria = { _id: ObjectId.createFromHexString(station._id) }
		const collection = await dbService.getCollection('station')
		await collection.updateOne(criteria, { $set: stationTosave })
		return stationTosave
		
	} catch (err) {
		logger.error(`cannot update station ${station._id}`, err)
		throw err
	}
}



