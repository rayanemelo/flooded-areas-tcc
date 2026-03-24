import { Router } from 'express';
import { listFloodAreaController } from '../infra/controllers/flood-area/list-flood-area-controller';
import { listFaqController } from './controllers/faq/list-faq-controller';
import { getFaqByIdController } from './controllers/faq/get-faq-by-id-controller';
import { createFaqController } from './controllers/faq/create-faq-controller';
import { updateFaqController } from './controllers/faq/update-faq-controller';
import { deleteFaqController } from './controllers/faq/delete-faq-controller';
import { createNotificationController } from './controllers/notification/create-notification-controller';
import { getNotificationByIdController } from './controllers/notification/get-notification-by-id-controller';
import { updateNotificationController } from './controllers/notification/update-notification-controller';
import { deleteNotificationController } from './controllers/notification/delete-notification-controller';
import { listNotificationController } from './controllers/notification/list-notification-controller';
import { createFloodAreaController } from './controllers/flood-area/create-flood-area-controller';
import { getFloodAreaByIdController } from './controllers/flood-area/get-flood-area-by-id-controller';

import { createSessionUserAdminController } from './controllers/auth/auth-user-admin/create-session-user-admin-controller';
import { sendSmsCodeController } from './controllers/auth/auth-user/send-sms-code-controller';
import { validateCodeController } from './controllers/auth/auth-user/validate-code-use-case';
import { authorize } from './middlewares/authorize';
import { listUserHistoryController } from './controllers/user/list-user-history-controller';
import { createImageFloodAreaController } from './controllers/images-flood-area/create-image-flood-area-controller';
import { getImagesFloodAreaController } from './controllers/images-flood-area/get-images-flood-area-controller';
import { listActiveFloodAreasController } from './controllers/flood-area/list-active-flood-area-controller';
import { listPendingFloodAreaByUserIdController } from './controllers/flood-area/list-pending-flood-area-by-user-id-controller';
import { updateFloodAreaByUserController } from './controllers/flood-area/update-flood-area-by-user-controller';
import { updateFloodAreaByAdminController } from './controllers/flood-area/update-flood-area-by-admin-controller';
import { saveUserAlertPreferencesController } from './controllers/user/save-user-alert-preferences-controller';
import { listCitiesByStateController } from './controllers/location/list-cities-by-state-controller';

export class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  public initializeRoutes(): Router {
    this.router.get('/flood-area', listFloodAreaController.handle);
    this.router.get(
      '/flood-area/active',
      listActiveFloodAreasController.handle
    );
    this.router.get(
      '/flood-area/:id',
      // authorize,
      getFloodAreaByIdController.handle
    );
    this.router.get(
      '/flood-area/user/pending',
      authorize,
      listPendingFloodAreaByUserIdController.handle
    );
    this.router.get(
      '/flood-area/:floodAreaId/images',
      getImagesFloodAreaController.handle
    );
    this.router.post(
      '/flood-area',
      authorize,
      createFloodAreaController.handle
    );
    this.router.post(
      '/flood-area/image',
      authorize,
      createImageFloodAreaController.handle
    );
    this.router.patch(
      '/flood-area/user/alert-response',
      authorize,
      updateFloodAreaByUserController.handle
    );
    this.router.patch(
      '/flood-area/:id',
      updateFloodAreaByAdminController.handle
    );

    this.router.get('/faq', listFaqController.handle);
    this.router.get('/faq/:id', getFaqByIdController.handle);
    this.router.post('/faq', createFaqController.handle);
    this.router.put('/faq/:id', updateFaqController.handle);
    this.router.delete('/faq/:id', deleteFaqController.handle);

    this.router.get('/notification', authorize, listNotificationController.handle);
    this.router.get('/notification/:id', getNotificationByIdController.handle);
    this.router.post('/notification', createNotificationController.handle);
    this.router.put('/notification/:id', updateNotificationController.handle);
    this.router.delete(
      '/notification/:id',
      deleteNotificationController.handle
    );

    this.router.post(
      '/auth-user-admin',
      createSessionUserAdminController.handle
    );

    this.router.post('/auth-user/send-sms', sendSmsCodeController.handle);
    this.router.post('/auth-user/validate-code', validateCodeController.handle);

    this.router.get(
      '/user-history',
      authorize,
      listUserHistoryController.handle
    );
    this.router.post(
      '/user/alert-preferences',
      authorize,
      saveUserAlertPreferencesController.handle
    );
    this.router.get('/location/cities', listCitiesByStateController.handle);

    return this.router;
  }
}
