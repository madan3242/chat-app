import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  ChatListInterface,
  ChatListItemInterface,
  UserInterface,
} from "../../interfaces";
import { requestHandler } from "../../utils";
import {
  addParticipantsToGroup,
  deleteGroupChat,
  getAvailableUsers,
  getGroupInfo,
  removeParticipantsFromGroup,
  updateGroupName,
} from "../../api";
import { Dialog, Transition } from "@headlessui/react";
import {
  CheckIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  UserPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Select from "./Select";

const GroupChatDetailsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  chatId: string;
  onGroupDelete: (chatId: string) => void;
}> = ({ open, onClose, chatId, onGroupDelete }) => {
  const { user } = useAuth();

  const [addingParticipant, setAddingParticipant] = useState(false);

  const [renamingGroup, setRenamingGroup] = useState(false);

  const [participantToBeAdded, setParticipantToBeAdded] = useState("");

  const [newGroupName, setNewGroupName] = useState("");

  const [groupDetails, setGroupDetails] =
    useState<ChatListItemInterface | null>(null);

  const [users, setUsers] = useState<UserInterface[]>([]);

  // Function to update the group name
  const handleGroupNameUpdate = async () => {
    // Check if the group name is provided.
    if (!newGroupName) return alert("Group name is required");

    //Request to update the group name.
    requestHandler(
      async () => await updateGroupName(chatId, newGroupName),
      null,
      (res) => {
        const { data } = res;
        setGroupDetails(data);
        setNewGroupName(data.name);
        setRenamingGroup(false);
        alert("Group name updated to " + data.name);
      },
      alert
    );
  };

  // Function to fetch users
  const getUsers = async () => {
    // Handle the request to get available users
    requestHandler(
      async () => await getAvailableUsers(),
      null,
      (res) => {
        const { data } = res;
        setUsers(data || []);
      },
      alert
    );
  };

  // Function to delete the group chat.
  const deleteGroup = async () => {
    // Check if the user is group admin
    if (groupDetails?.admin !== user?._id) {
      return alert("You are not the admin of the group");
    }

    // Request to delete the group chat.
    requestHandler(
      async () => await deleteGroupChat(chatId),
      null,
      () => {
        onGroupDelete(chatId);
        handleClose();
      },
      alert
    );
  };

  const removeParticipant = async (participantId: string) => {
    // Request to remove participant from group chat.
    requestHandler(
      async () => await removeParticipantsFromGroup(chatId, participantId),
      null,
      () => {
        const updateGroupDetails = {
          ...groupDetails,
          participants:
            (groupDetails?.participants &&
              groupDetails?.participants?.filter(
                (p) => p._id !== participantId
              )) ||
            [],
        };

        setGroupDetails(updateGroupDetails as ChatListInterface);

        alert("Participant removed");
      },
      alert
    );
  };

  // Function to add participant
  const addParticipant = async () => {
    if (!participantToBeAdded)
      return alert("Please select a participant to add.");

    requestHandler(
      async () => await addParticipantsToGroup(chatId, participantToBeAdded),
      null,
      (res) => {
        const { data } = res;

        const updateGroupDetails = {
          ...groupDetails,
          participants: data?.participants || [],
        };

        setGroupDetails(updateGroupDetails as ChatListInterface);

        alert("Participant added");
      },
      alert
    );
  };

  // Function to fetch group information
  const fetchGroupInformation = async () => {
    requestHandler(
      async () => await getGroupInfo(chatId),
      null,
      (res) => {
        const { data } = res;
        setGroupDetails(data);
        setNewGroupName(data?.name || "");
      },
      alert
    );
  };

  // Function to handle modal or component closure
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!open) return;

    fetchGroupInformation();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="transform tarsition ease-in-out duration-500 sm:duration-700"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transform tarsition ease-in-out duration-500 sm:duration-700"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-purple-50" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform tarsition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform tarsition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl bg-purple-300/50">
                  <div className="flex h-full flex-col overflow-y-scroll py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md text-purple-400 hover:text-purple-500/50 focus:outline-none"
                            onClick={handleClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-9 w-9" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      <div className="flex flex-col justify-center items-start">
                        <div className="flex pl-16 justify-center items-center relative w-full h-max gap-3">
                          {groupDetails?.participants?.slice(0, 3).map((p) => {
                            return (
                              <img
                                className="w-24 h-24 -ml-16 rounded-full outline outline-4 outline-purple-300"
                                key={p._id}
                                src={p.avatar}
                                alt="avatar"
                              />
                            );
                          })}
                          {groupDetails?.participants &&
                          groupDetails?.participants?.length > 3 ? (
                            <p>+{groupDetails?.participants?.length - 3}</p>
                          ) : null}
                        </div>
                        <div className="w-full flex flex-col justify-center items-center text-center">
                          {renamingGroup ? (
                            <div className="w-full flex justify-center items-center mt-5 gap-2">
                              <input
                                type="text"
                                className="block w-full rounded-xl outline outline-[1px] outline-purple-500 border-0 py-4 px-5 bg-purple-400 text-white font-light placeholder:text-white/70"
                                placeholder="Enter new group name..."
                                value={newGroupName}
                                onChange={(e) =>
                                  setNewGroupName(e.target.value)
                                }
                              />
                              <button
                                onClick={handleGroupNameUpdate}
                                className=""
                              >
                                <CheckIcon className="h-7 w-7 text-green-500" />
                              </button>
                              <button
                                onClick={() => setRenamingGroup(false)}
                                className=""
                              >
                                <XMarkIcon className="h-7 w-7 text-red-500" />
                              </button>
                            </div>
                          ) : (
                            <div className="w-full inline-flex justify-center items-center text-center mt-5">
                              <h1 className="text-2xl font-semibold truncate text-purple-600">
                                {groupDetails?.name}
                              </h1>
                              {groupDetails?.admin === user?._id ? (
                                <button onClick={() => setRenamingGroup(true)}>
                                  <PencilIcon className="w-5 h-5 ml-4" />
                                </button>
                              ) : null}
                            </div>
                          )}

                          <p className="mt-2 text-zinc-400 text-sm">
                            Group · {groupDetails?.participants?.length}{" "}
                            participants
                          </p>
                        </div>
                        <hr className="border-[0.1px] border-purple-600 my-5 w-full" />
                        <div className="w-full">
                          <p className="inline-flex items-center">
                            <UserGroupIcon className="h-6 w-6 mr-2" />{" "}
                            {groupDetails?.participants?.length} Participants
                          </p>
                          <div className="w-full">
                            {groupDetails?.participants?.map((participant) => {
                              return (
                                <Fragment key={participant?._id}>
                                  <div className="flex justify-between items-center w-full py-4">
                                    <div className="flex justify-start items-start gap-3 w-full">
                                      <img
                                        className="h-12 w-12 rounded-full"
                                        src={participant?.avatar}
                                      />
                                      <div>
                                        <p className="text-purple-600 font-semibold text-sm inline-flex items-center w-full">
                                          {participant.username}{" "}
                                          {participant._id ===
                                          groupDetails.admin ? (
                                            <span className="ml-2 text-[10px] px-4 bg-slate-950/10 order-[0.1px] border-success rounded-full text-success">
                                              admin
                                            </span>
                                          ) : null}
                                        </p>
                                        <small className="text-zinc-400">
                                          {participant.email}
                                        </small>
                                      </div>
                                    </div>
                                    {groupDetails.admin === user?._id ? (
                                      <div>
                                        <button
                                          className="text-red-500"
                                          onClick={() => {
                                            const ok = confirm(
                                              "Are you sure you want to remove " +
                                                user.username +
                                                " ? "
                                            );
                                            if (ok) {
                                              removeParticipant(
                                                participant._id || ""
                                              );
                                            }
                                          }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ) : null}
                                  </div>
                                  <hr className="border-[0.1px] border-purple-600 my-1 w-full" />
                                </Fragment>
                              );
                            })}
                            {groupDetails?.admin === user?._id ? (
                              <div className="w-full my-5 flex flex-col justify-center items-center gap-4">
                                {!addingParticipant ? (
                                  <button
                                    onClick={() => setAddingParticipant(true)}
                                    className="w-full p-2 m-2 bg-purple-400 text-white rounded-lg flex items-center justify-center"
                                  >
                                    <UserPlusIcon className="w-5 h-5 mr-1" />{" "}
                                    Add participant
                                  </button>
                                ) : (
                                  <div className="w-full flex justify-start items-center gap-2">
                                    <Select
                                      placeholder="Select a user to add..."
                                      value={participantToBeAdded}
                                      options={users.map((user) => ({
                                        label: user.username,
                                        value: user._id,
                                      }))}
                                      onChange={({ value }) => {
                                        setParticipantToBeAdded(value);
                                      }}
                                    />
                                    <button
                                      onClick={() => addParticipant()}
                                      className="p-2 m-2 bg-purple-400 text-white rounded-lg flex items-center justify-center"
                                    >
                                      <UserPlusIcon className="w-5 h-5" /> Add
                                    </button>
                                    <button
                                      onClick={() => {
                                        setAddingParticipant(false);
                                        setParticipantToBeAdded("");
                                      }}
                                      className="p-2 m-2 bg-purple-400 text-white rounded-lg flex items-center justify-center"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                                <button
                                  onClick={() => {
                                    const ok = confirm(
                                      "Are you sure you want to delete this group?"
                                    );
                                    if (ok) {
                                      deleteGroup();
                                    }
                                  }}
                                  className="w-full p-2 m-2 bg-purple-400 text-red-500 rounded-lg flex items-center justify-center"
                                >
                                  <TrashIcon className="w-5 h-5 mr-1" /> Delete
                                  group
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default GroupChatDetailsModal;
