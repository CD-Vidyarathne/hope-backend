import { Request, Response } from "express";
import Event from "../models/eventModel";
import { EventStatus } from "../types/enums";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      organizerId,
      eventName,
      purpose,
      venue,
      date,
      time,
      eventPicURL,
      committeeEmails,
      participantsExpected,
    } = req.body;

    const newEvent = await Event.create({
      organizerId,
      eventName,
      purpose,
      venue,
      date,
      time,
      eventPicURL,
      committeeEmails: committeeEmails || [], // Ensure it is an array
      participantsExpected,
      status: EventStatus.PENDING, // Default status
    });

    res
      .status(201)
      .json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const whereCondition = status ? { status } : {}; // Filter by status if provided

    const events = await Event.findAll({
      where: whereCondition,
      order: [["date", "DESC"]],
    });

    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    await event.update(updatedData);
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
