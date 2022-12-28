/* eslint-disable no-unused-vars */
const model = require("../models/db");
const ADMIN = model.admins;
const USER = model.users;
const LOCATION = model.locations;
const CHALLENGE = model.challenges;
const USERCHALLENGES = model.userChallenges;
const { param, body, validationResult } = require("express-validator");
const response = require("../helper/response");
const utility = require("../helper/utility");
const moment = require("moment");
const cron = require("node-cron");
const { AdminLogger } = require("../logger/logger");
const { Op } = require("sequelize");
const db = require("../models/db");
const constants = require("../helper/constants");
