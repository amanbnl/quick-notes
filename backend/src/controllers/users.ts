import { Request, Response } from "express";
import { handleErrorResponse, handleSuccessResponse } from "../lib/utils";
import { userService } from "../services/users";
import { HTTP_STATUS, HTTP_STATUS_MESSAGES } from "../lib/constants";
import { CustomError } from "../interfaces/customError";
import { authService } from "../services/auth";
import { AuthenticatedRequest } from "../interfaces/common";
const dummyUsers = [
  { fullName: "Arjun Mehta", email: "arjun.mehta@example.com", password: "Password123!" },
  { fullName: "Priya Sharma", email: "priya.sharma@testmail.com", password: "Password123!" },
  { fullName: "Liam O'Connor", email: "liam.oconnor@provider.net", password: "Password123!" },
  { fullName: "Sasha Ivanova", email: "sasha.i@domain.org", password: "Password123!" },
  { fullName: "Hiroshi Tanaka", email: "h.tanaka@webmail.jp", password: "Password123!" },
  { fullName: "Elena Rodriguez", email: "elena.rod@services.com", password: "Password123!" },
  { fullName: "Kwame Mensah", email: "kwame.m@africa-online.net", password: "Password123!" },
  { fullName: "Fatima Al-Sayed", email: "fatima.alsayed@corp.com", password: "Password123!" },
  { fullName: "Lucas Schmidt", email: "l.schmidt@berlin.de", password: "Password123!" },
  { fullName: "Isabella Rossi", email: "isabella.rossi@italy.it", password: "Password123!" },
  { fullName: "Chen Wei", email: "chen.wei@asia-pacific.cn", password: "Password123!" },
  { fullName: "Amara Diallo", email: "amara.d@west-africa.com", password: "Password123!" },
  { fullName: "Mateo Silva", email: "m.silva@brasil.br", password: "Password123!" },
  { fullName: "Amina Begum", email: "amina.b@dhaka.bd", password: "Password123!" },
  { fullName: "Noah Williams", email: "noah.w@london.uk", password: "Password123!" },
  { fullName: "Yuki Sato", email: "yuki.sato@tokyo.jp", password: "Password123!" },
  { fullName: "Sofia Jensen", email: "sofia.j@copenhagen.dk", password: "Password123!" },
  { fullName: "Zaid Khan", email: "zaid.khan@mumbai.in", password: "Password123!" },
  { fullName: "Chloe Lefebvre", email: "chloe.l@paris.fr", password: "Password123!" },
  { fullName: "Omar Hassan", email: "omar.h@cairo.eg", password: "Password123!" },
  { fullName: "Emma Wilson", email: "emma.wilson@sydney.au", password: "Password123!" },
  { fullName: "Diego Garcia", email: "diego.g@madrid.es", password: "Password123!" },
  { fullName: "Ananya Iyer", email: "ananya.iyer@bangalore.in", password: "Password123!" },
  { fullName: "Samuel Kim", email: "sam.kim@seoul.kr", password: "Password123!" },
  { fullName: "Maria Costa", email: "m.costa@lisbon.pt", password: "Password123!" },
  { fullName: "Ali Reza", email: "ali.reza@tehran.ir", password: "Password123!" },
  { fullName: "Grace Taylor", email: "grace.t@toronto.ca", password: "Password123!" },
  { fullName: "Ravi Varma", email: "ravi.varma@delhi.in", password: "Password123!" },
  { fullName: "Olga Smirnova", email: "olga.s@moscow.ru", password: "Password123!" },
  { fullName: "Jakub Kowalski", email: "j.kowalski@warsaw.pl", password: "Password123!" },
  { fullName: "Layla Mubarak", email: "layla.m@dubai.ae", password: "Password123!" },
  { fullName: "Sebastian Müller", email: "s.muller@vienna.at", password: "Password123!" },
  { fullName: "Zara Ahmed", email: "zara.a@karachi.pk", password: "Password123!" },
  { fullName: "Leo Dubois", email: "leo.d@brussels.be", password: "Password123!" },
  { fullName: "Nisha Gupta", email: "nisha.gupta@pune.in", password: "Password123!" },
  { fullName: "Felix Berg", email: "felix.berg@stockholm.se", password: "Password123!" },
  { fullName: "Mila Popovic", email: "mila.p@belgrade.rs", password: "Password123!" },
  { fullName: "Kenji Nakamura", email: "kenji.n@osaka.jp", password: "Password123!" },
  { fullName: "Dante Alighieri", email: "dante.a@florence.it", password: "Password123!" },
  { fullName: "Saanvi Reddy", email: "saanvi.reddy@hyderabad.in", password: "Password123!" },
  { fullName: "Hugo Larsson", email: "hugo.l@oslo.no", password: "Password123!" },
  { fullName: "Inaya Malik", email: "inaya.m@istanbul.tr", password: "Password123!" },
  { fullName: "Arthur Morgan", email: "arthur.m@west.us", password: "Password123!" },
  { fullName: "Maya Angelou", email: "maya.a@poetry.org", password: "Password123!" },
  { fullName: "Nikola Tesla", email: "nikola.t@energy.io", password: "Password123!" },
  { fullName: "Marie Curie", email: "marie.curie@science.edu", password: "Password123!" },
  { fullName: "Alan Turing", email: "alan.t@logic.ac.uk", password: "Password123!" },
  { fullName: "Ada Lovelace", email: "ada.l@comp.org", password: "Password123!" },
  { fullName: "Leonardo DaVinci", email: "leo.dv@art.it", password: "Password123!" },
  { fullName: "Isaac Newton", email: "isaac.n@gravity.uk", password: "Password123!" }
];
export const createUser = async (req: Request, res: Response) => {
  try {
    const userId = await userService.createUser(req.body)
    return handleSuccessResponse({ res, message: HTTP_STATUS_MESSAGES.CREATED, data: [{ id: userId }] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const fetchUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id
    const userDetails = await userService.getUserDetails(userId as string)
    if (!userDetails) {
      throw new CustomError({ message: HTTP_STATUS_MESSAGES.NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    return handleSuccessResponse({ res, message: HTTP_STATUS_MESSAGES.OK, data: [userDetails] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const updateUserDetails = async (req: Request, res: Response) => {
  try {
    const userId = await userService.updateUserDetails(req.params.id as string, req.body)
    return handleSuccessResponse({ res, message: HTTP_STATUS_MESSAGES.OK, data: [{ id: userId }] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const deleteUserDetails = async (req: Request, res: Response) => {
  try {
    await userService.deleteUserDetails(req.params.id as string)
    return handleSuccessResponse({ res, message: HTTP_STATUS_MESSAGES.OK, data: [] })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const verifyUser = async (req: Request, res: Response) => {
  try {
    await userService.verifyUserAccount(req.query.token as string)
    return handleSuccessResponse({ res, message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const loginResponse = await authService.login(req.body)
    return handleSuccessResponse({ res, data: [loginResponse], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const searchUser = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm
    const searchList = await userService.searchUser(searchTerm as string)
    return handleSuccessResponse({ res, data: searchList, message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    await userService.resetPassword({ ...req.body, userId: (req as AuthenticatedRequest).user.sub })
    return handleSuccessResponse({ res, data: [], message: HTTP_STATUS_MESSAGES.OK })
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const queryParam = req.query.step || 'step1'
    if (queryParam === 'step1') {
      const reqBody = {
        email: req.body.email
      }
      await userService.forgotPassword(reqBody)
      return handleSuccessResponse({ res, data: [], message: "Email sent successfully" })
    } else {
      const reqBody = {
        newPassword: req.body.newPassword,
        confirmPassword: req.body.confirmPassword,
        userId: (req as AuthenticatedRequest).user.sub
      }
      await userService.forgotPassword(reqBody)
      return handleSuccessResponse({ res, data: [], message: "Password changed successfully" })
    }
  } catch (error) {
    return handleErrorResponse(res, error)
  }
}