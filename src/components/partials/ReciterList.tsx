import React, { useEffect } from 'react';
import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { HiCheck, HiSelector } from 'react-icons/hi';
import { Edition } from '@/types';
import { useAppSelector } from '@/hooks/use-app-selector';
import { getReciter, setReciter } from '@/store/settings/settingSlice';
import { useAppDispatch } from '@/hooks/use-app-dispatch';

type Props = {
  reciters: Edition[];
};

const ReciterList = ({ reciters }: Props) => {
  const defaultReciter = useAppSelector(getReciter);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<Edition>(
    reciters.find((reciter) => reciter.identifier === defaultReciter.identifier) as Edition
  );
  const [query, setQuery] = useState('');

  const filteredPeople =
    query === ''
      ? reciters
      : reciters.filter((reciter) =>
          reciter.englishName.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  useEffect(() => {
    dispatch(setReciter(selected));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <Combobox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <div className="relative w-full cursor-default overflow-hidden rounded-full bg-white dark:bg-gray-800 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <Combobox.Input
            className="w-full bg-transparent border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-700 dark:text-white focus:ring-0 focus:border-none focus:outline-none"
            displayValue={(reciter: Edition) => reciter.englishName}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}
        >
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPeople.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-white">
                Nothing found.
              </div>
            ) : (
              filteredPeople.map((reciter) => (
                <Combobox.Option
                  key={reciter.identifier}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-primary-500 text-white' : 'text-gray-700 dark:text-white'
                    }`
                  }
                  value={reciter}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {reciter.englishName}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-primary-500'
                          }`}
                        >
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default ReciterList;
