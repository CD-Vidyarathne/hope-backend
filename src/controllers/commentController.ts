import { Request, Response } from "express";
import Comment from "../models/comment";
import logger from "../utils/logger";
import { Roles } from "../types/roles";

export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;
  const blogId = req.params.id;
  const userId = req.user?.id;

  try {
    const comment = await Comment.create({
      content: content,
      blogid: blogId,
      userid: userId,
    });

    logger.info(
      `User ${userId} created Comment ${comment.id} on Blog ${blogId}.`,
    );
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    logger.error(`Failed to create comment: ${error}`);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

export const getCommentsByBlogId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { blogid: id },
      include: [{ association: "author", attributes: ["username"] }],
    });

    if (!comments || comments.length === 0) {
      logger.warn(`No comments found for Blog ${id}.`);
      res.status(404).json({ error: "No comments found for this blog" });
      return;
    }

    logger.info(`Fetched comments for Blog ${id}.`);
    res
      .status(200)
      .json({ message: "Comments fetched successfully", comments });
  } catch (error) {
    logger.error(`Failed to fetch comments for Blog ${id}: ${error}`);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

export const getCommentById = async (req: Request, res: Response) => {
  const { id, commentId } = req.params;

  try {
    const comment = await Comment.findOne({
      where: { blogid: id, id: commentId },
      include: [{ association: "author", attributes: ["username"] }],
    });

    if (!comment) {
      logger.warn(`Comment with ID ${commentId} not found on Blog ${id}.`);
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    logger.info(`Fetched Comment ${commentId} for Blog ${id}.`);
    res.status(200).json({ message: "Comment fetched successfully", comment });
  } catch (error) {
    logger.error(`Failed to fetch comment ${commentId}: ${error}`);
    res.status(500).json({ error: "Failed to fetch comment" });
  }
};

export const updateComment = async (req: Request, res: Response) => {
  const { id, commentId } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  try {
    const comment = await Comment.findOne({
      where: { blogid: id, id: commentId },
    });

    if (!comment) {
      logger.warn(`Comment with ID ${commentId} not found on Blog ${id}.`);
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (comment.userid !== userId) {
      logger.warn(`User ${userId} attempted to update Comment ${commentId}.`);
      res
        .status(403)
        .json({ error: "You do not have permission to update this comment" });
      return;
    }

    comment.content = content;
    await comment.save();

    logger.info(
      `Comment ${commentId} updated by User ${userId} for Blog ${id}.`,
    );
    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    logger.error(`Failed to update comment ${commentId}: ${error}`);
    res.status(500).json({ error: "Failed to update comment" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  const { id, commentId } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    const comment = await Comment.findOne({
      where: { blogid: id, id: commentId },
    });

    if (!comment) {
      logger.warn(`Comment with ID ${commentId} not found on Blog ${id}.`);
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    if (
      comment.userid !== userId &&
      userRole !== Roles.ADMIN &&
      userRole !== Roles.MODERATOR
    ) {
      logger.warn(`User ${userId} attempted to delete Comment ${commentId}.`);
      res
        .status(403)
        .json({ error: "You do not have permission to delete this comment" });
      return;
    }

    await comment.destroy();

    logger.info(
      `Comment ${commentId} deleted by User ${userId} for Blog ${id}.`,
    );
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete comment ${commentId}: ${error}`);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
