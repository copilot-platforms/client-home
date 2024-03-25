import { useAppState } from '@/hooks/useAppState';
import { IClient, ICustomField } from '@/types/interfaces';
import { staticAutofillValues } from '@/utils/constants';
import { TiptapEditorUtils } from '@/utils/tiptapEditorUtils';
import { Editor } from '@tiptap/react';
import { When } from '../hoc/When';
import { useEffect, useState } from 'react';

const AutofillFields = () => {
  const appState = useAppState();

  const [remainingAutofill, setRemainingAutofill] = useState<ICustomField[]>(
    []
  );

  const tiptapEditorUtils = new TiptapEditorUtils(
    appState?.appState.editor as Editor
  );

  function getRemainingAutofillFields(
    customFields: ICustomField[],
    clientCustomField: any
  ) {
    return customFields.filter(
      (itemA: any) => !Object.keys(clientCustomField).includes(itemA.key)
    );
  }

  useEffect(() => {
    if (!appState?.appState?.selectedClient && !appState?.appState?.readOnly)
      return;
    appState?.setClientCompanyName('');
    (async () => {
      appState?.setLoading(true);
      const output = getRemainingAutofillFields(
        appState?.appState.customFields,
        appState?.appState.selectedClient?.customFields
      );
      setRemainingAutofill(output);
      const res = await fetch(
        `/api/companies?companyId=${appState?.appState.selectedClient?.companyId}&token=${appState?.appState?.token}`
      );
      const { data } = await res.json();
      if (data.name) {
        appState?.setClientCompanyName(data.name);
      } else {
        appState?.setClientCompanyName('');
      }
      appState?.setLoading(false);
    })();
  }, [appState?.appState?.selectedClient]);

  return (
    <div className='p-5'>
      <p className='font-medium pb-5'>Autofill fields</p>
      <div className='flex flex-col gap-5'>
        {/* readonly mode */}
        <When condition={appState?.appState?.readOnly as boolean}>
          <AutofillTextStaticField
            labelName={'Given name'}
            labelValues={
              appState?.appState?.selectedClient?.givenName as string
            }
          />
          <AutofillTextStaticField
            labelName={'Family name'}
            labelValues={
              appState?.appState?.selectedClient?.familyName as string
            }
          />
          <AutofillTextStaticField
            labelName={'Email'}
            labelValues={appState?.appState?.selectedClient?.email as string}
          />
          <AutofillTextStaticField
            labelName={'Company'}
            labelValues={
              appState?.appState?.selectedClientCompanyName
                ? appState?.appState?.selectedClientCompanyName
                : ''
            }
          />
          {appState?.appState?.selectedClient &&
            Object.keys(
              (appState?.appState?.selectedClient as IClient)?.customFields
            ).length > 0 &&
            Object.entries(
              (appState?.appState?.selectedClient as IClient)?.customFields
            ).map((value, key) => {
              return (
                <AutofillTextReadonlyMode
                  key={key}
                  labelName={value[0]}
                  labelValues={value[1]}
                />
              );
            })}
          {appState?.appState?.selectedClient &&
            remainingAutofill.map((el, key) => {
              return (
                <AutofillTextStaticField
                  key={key}
                  labelName={el.name}
                  labelValues={''}
                />
              );
            })}
        </When>

        {/* edit mode */}
        <When condition={!appState?.appState.readOnly}>
          {staticAutofillValues.map((el, key) => {
            return (
              <AutofillText
                key={key}
                label={el.replaceAll('{{', '').replaceAll('}}', '')}
                handleClick={() => {
                  if (appState?.appState.readOnly) return;
                  tiptapEditorUtils.insertAutofill(`${el}`);
                }}
              />
            );
          })}
          {appState?.appState.customFields &&
            appState?.appState.customFields.map((el, key) => {
              return (
                <AutofillText
                  key={key}
                  label={`client.${el.key}`}
                  handleClick={() => {
                    if (appState?.appState.readOnly) return;
                    tiptapEditorUtils.insertAutofill(`{{client.${el.key}}}`);
                  }}
                />
              );
            })}
        </When>
      </div>
    </div>
  );
};

export default AutofillFields;

const AutofillText = ({
  label,
  handleClick,
}: {
  label: string;
  handleClick?: () => void;
}) => {
  return (
    <p
      className='text-new-gray hover:text-text cursor-pointer'
      onClick={handleClick}
    >
      &#123;&#123;{label}&#125;&#125;
    </p>
  );
};

const AutofillTextStaticField = ({
  labelName,
  labelValues,
}: {
  labelName: string;
  labelValues: string;
}) => {
  return (
    <p className='text-new-gray hover:text-text cursor-pointer'>
      {labelName}: {labelValues}
    </p>
  );
};

const AutofillTextReadonlyMode = ({
  labelName,
  labelValues,
}: {
  labelName: string;
  labelValues: string | string[];
}) => {
  const appState = useAppState();
  const name = appState?.appState.customFields.find(
    (el) => el.key === labelName
  )?.name;
  if (Array.isArray(labelValues)) {
    return (
      <p className='text-new-gray hover:text-text cursor-pointer'>
        {name}: {labelValues.join(', ')}
      </p>
    );
  } else {
    return (
      <p className='text-new-gray hover:text-text cursor-pointer'>
        {name}: {labelValues}
      </p>
    );
  }
};

/**
  *
THIS CODE REMAINS COMMENTED BECAUSE IT MIGHT BE A NEED LATER
THIS CODE MOVES THE CURSOR TO THE searchText TEXT
*/
// import { TextSelection } from 'prosemirror-state';
// const moveCursor = (searchText: string) => {
//   if (editor) {
//     const pos = editor.getText().indexOf(searchText);

//     if (!pos) return;

//     if (pos !== -1) {
//       const { state } = editor;
//       const resolvedPos = state.doc.resolve(pos + searchText.length); // Move to the end of the matched text
//       console.log(resolvedPos)
//       const selection = TextSelection.create(state.doc, resolvedPos.pos);
//       editor.chain().focus().setTextSelection({ to: selection.to, from: selection.from }).run()

//     }
//   }
// };
