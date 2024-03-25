'use client';

import {
  IClient,
  ICustomField,
  INotification,
  ISettings,
} from '@/types/interfaces';
import { Editor } from '@tiptap/react';
import { FC, ReactNode, useState, createContext, useEffect } from 'react';
import { AppDataProvider } from '@/hooks/useAppData';

export interface IAppState {
  editor: Editor | null;
  bannerImgUrl: string | Blob | null;
  bannerImgId: string;
  showLinkInput: boolean;
  readOnly: boolean;
  selectedClient: IClient | null;
  selectedClientCompanyName: string;
  editorColor: string;
  changesCreated: boolean;
  settings: ISettings | undefined;
  originalTemplate: string | undefined;
  displayTasks: boolean;
  loading: boolean;
  showNotificationsModal: boolean;
  //this data should be fetched from API in the future
  clientList: IClient[];
  customFields: ICustomField[];
  token: string;
  notifications: INotification | undefined;
}

export interface IAppContext {
  appState: IAppState;
  toggleShowLinkInput: (v: boolean) => void;
  toggleReadOnly: (v: boolean) => void;
  setSelectedClient: (client: IClient | null) => void;
  setEditorColor: (color: string) => void;
  setEditor: (editor: Editor | null) => void;
  toggleChangesCreated: (v: boolean) => void;
  setSettings: (settings: ISettings) => void;
  setOriginalTemplate: (template: string) => void;
  toggleDisplayTasks: (options?: { override: boolean }) => void;
  toggleNotificationsModal: () => void;
  setLoading: (v: boolean) => void;
  setClientList: (clientList: IClient[]) => void;
  setCustomFields: (customFields: ICustomField[]) => void;
  setClientCompanyName: (companyName: string) => void;
  setBannerImgUrl: (imageUrl: string | Blob | null) => void;
  setBannerImgId: (imageId: string) => void;
  setToken: (token: string) => void;
  setNotification: (notification: INotification) => void;
}

interface IAppCoreProvider {
  children: ReactNode;
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider: FC<IAppCoreProvider> = ({ children }) => {
  const [state, setState] = useState<IAppState>({
    bannerImgUrl: null,
    bannerImgId: '',
    showLinkInput: false,
    readOnly: false,
    selectedClient: null,
    selectedClientCompanyName: '',
    editorColor: '#FFFFFF',
    editor: null,
    changesCreated: false,
    settings: undefined,
    originalTemplate: undefined,
    displayTasks: false,
    loading: false,
    clientList: [],
    customFields: [],
    token: '',
    showNotificationsModal: false,
    notifications: undefined,
  });

  const toggleShowLinkInput = (v: boolean) => {
    setState((prev) => ({ ...prev, showLinkInput: v }));
  };

  const toggleReadOnly = (v: boolean) => {
    setState((prev) => ({ ...prev, readOnly: v }));
  };

  const setSelectedClient = (client: IClient | null) => {
    setState((prev) => ({ ...prev, selectedClient: client }));
  };

  const setEditorColor = (color: string) => {
    setState((prev) => ({ ...prev, editorColor: color }));
  };

  const setEditor = (editor: Editor | null) => {
    setState((prev) => ({ ...prev, editor: editor }));
  };

  const toggleChangesCreated = (v: boolean) => {
    setState((prev) => ({ ...prev, changesCreated: v }));
  };

  const setSettings = (settings: ISettings) => {
    setState((prev) => ({ ...prev, settings: settings }));
  };

  const setOriginalTemplate = (template: string) => {
    setState((prev) => ({ ...prev, originalTemplate: template }));
  };

  const toggleDisplayTasks = (options?: { override: boolean }) => {
    setState((prev) => ({
      ...prev,
      displayTasks: options ? options.override : !prev.displayTasks,
    }));
  };

  const toggleNotificationsModal = () => {
    setState((prev) => ({
      ...prev,
      showNotificationsModal: !prev.showNotificationsModal,
    }));
  };

  const setLoading = (v: boolean) => {
    setState((prev) => ({ ...prev, loading: v }));
  };

  const setClientList = (clientList: IClient[]) => {
    setState((prev) => ({ ...prev, clientList: clientList }));
  };

  const setCustomFields = (customFields: ICustomField[]) => {
    setState((prev) => ({ ...prev, customFields: customFields }));
  };

  const setClientCompanyName = (companyName: string) => {
    setState((prev) => ({ ...prev, selectedClientCompanyName: companyName }));
  };

  const setBannerImgUrl = (imageUrl: string | Blob | null) => {
    setState((prev) => ({ ...prev, bannerImgUrl: imageUrl }));
  };

  const setBannerImgId = (imageId: string) => {
    setState((prev) => ({ ...prev, bannerImgId: imageId }));
  };

  const setToken = (token: string) => {
    setState((prev) => ({ ...prev, token: token }));
  };

  const setNotification = (notification: INotification) => {
    setState((prev) => ({ ...prev, notifications: notification }));
  };

  return (
    <AppContext.Provider
      value={{
        appState: state,
        toggleShowLinkInput,
        toggleReadOnly,
        setSelectedClient,
        setEditorColor,
        setEditor,
        toggleChangesCreated,
        setSettings,
        setOriginalTemplate,
        toggleDisplayTasks,
        toggleNotificationsModal,
        setLoading,
        setClientList,
        setCustomFields,
        setClientCompanyName,
        setBannerImgUrl,
        setBannerImgId,
        setToken,
        setNotification,
      }}
    >
      <AppDataProvider>{children}</AppDataProvider>
    </AppContext.Provider>
  );
};
