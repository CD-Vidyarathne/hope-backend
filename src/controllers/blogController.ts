import { Request, Response } from "express";
import Blog from "../models/blog";
import logger from "../utils/logger";
import { Roles } from "../types/roles";

export const createBlog = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user?.id;

  try {
    const blog = await Blog.create({ title, content, userid: userId });
    logger.info(`User ${userId} created Blog ${blog.id}.`);
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    logger.error(`Failed to create blog: ${error}`);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { association: "author", attributes: ["id", "username"] },
        {
          association: "comments",
          attributes: ["id", "content", "timestamp"],
          include: [
            {
              association: "author",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    logger.info("Fetched all blogs.");
    res
      .status(201)
      .json({ message: "Blogs Fetched successfully", blogs: blogs });
  } catch (error) {
    logger.error(`Failed to fetch blogs: ${error}`);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id, {
      include: [
        { association: "author", attributes: ["id", "username"] },
        {
          association: "comments",
          attributes: ["id", "content", "timestamp"],
          include: [
            {
              association: "author",
              attributes: ["id", "username"],
            },
          ],
        },
      ],
    });

    if (!blog) {
      logger.warn(`Blog with ID ${id} not found.`);
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    logger.info(`Fetched Blog ${id}.`);
    res.status(201).json({ message: "Blog Fetched successfully", blog: blog });
  } catch (error) {
    logger.error(`Failed to fetch blog ${id}: ${error}`);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user?.id;

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      logger.warn(`Blog with ID ${id} not found.`);
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    if (blog.userid !== userId) {
      logger.warn(`User ${userId} attempted to update Blog ${id}.`);
      res
        .status(403)
        .json({ error: "You do not have permission to update this blog" });
      return;
    }

    blog.title = title;
    blog.content = content;
    await blog.save();

    logger.info(`Blog ${id} updated by User ${userId}.`);
    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    logger.error(`Failed to update blog ${id}: ${error}`);
    res.status(500).json({ error: "Failed to update blog" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    const blog = await Blog.findByPk(id);

    if (!blog) {
      logger.warn(`Blog with ID ${id} not found.`);
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    if (
      blog.userid !== userId &&
      userRole !== Roles.ADMIN &&
      userRole !== Roles.MODERATOR
    ) {
      logger.warn(`User ${userId} attempted to delete Blog ${id}.`);
      res
        .status(403)
        .json({ error: "You do not have permission to delete this blog" });
      return;
    }

    await blog.destroy();

    logger.info(`Blog ${id} deleted by User ${userId}(${userRole}).`);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    logger.error(`Failed to delete blog ${id}: ${error}`);
    res.status(500).json({ error: "Failed to delete blog" });
  }
};
