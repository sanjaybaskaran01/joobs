import React, { JSX, useState } from "react";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { addFriendByCode } from "../api/api";

interface AddFriendProps {
  onBack: () => void;
}

export const AddFriend = ({ onBack }: AddFriendProps): JSX.Element => {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleAddFriend = async () => {
    if (!inviteCode.trim()) {
      setMessage("Please enter an invite code");
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await addFriendByCode(inviteCode.trim());
      
      if (response.success) {
        setSuccess(true);
        setMessage(response.message || "Friend added successfully!");
        setInviteCode("");
        // Auto-navigate back after 2 seconds
        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        setSuccess(false);
        setMessage(response.message || "Failed to add friend");
      }
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.response?.data?.message || "An error occurred while adding friend");
      console.error("Error adding friend:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValidCode = inviteCode.trim().length > 0;
  return (
    <div className="flex flex-col min-h-[600px] max-h-[600px] w-full max-w-[800px] overflow-hidden">
      <header className="flex w-full items-center justify-between px-4 py-3 bg-white rounded-t-[20px] flex-shrink-0">
        <img
          className="w-[100px] h-8 sm:w-[120px] sm:h-11 object-contain"
          alt="Logo"
          src="/popup/logo.png"
        />

        <Button 
          className="px-4 py-2 sm:px-6 sm:py-3 bg-[#0076ff] rounded-[20px] hover:bg-[#0076ff]/90" 
          onClick={onBack}
          disabled={loading}
        >
          <div className="[font-family:'Noto_Sans',Helvetica] font-semibold text-white text-lg sm:text-xl">
            Back
          </div>
        </Button>
      </header>

      <main className="flex flex-col flex-1 items-center gap-6 p-4 sm:p-6 bg-white overflow-y-auto">
        <div className="flex items-center justify-center w-full">
          <h1 className="[font-family:'Noto_Sans',Helvetica] font-semibold text-[#343232] text-xl sm:text-2xl text-center">
            Add a friend
          </h1>
        </div>

        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <div className="flex flex-col items-start gap-2 w-full">
            <label className="[font-family:'Noto_Sans',Helvetica] font-medium text-[#343232] text-sm">
              Friend's Invite Code
            </label>
            <div className="flex flex-col items-start w-full bg-white rounded-[10px] border border-solid border-[#e0e0e0] focus-within:border-[#0076ff] transition-colors">
              <div className="flex flex-col items-start justify-center gap-2 p-4 w-full">
                <Input
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter your friend's invite code"
                  className="w-full border-0 bg-transparent p-0 [font-family:'Noto_Sans',Helvetica] font-normal text-[#343232] text-lg placeholder:text-[#9f9f9f] focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={loading}
                />
              </div>
            </div>
            {inviteCode && (
              <div className="text-xs text-[#9f9f9f]">
                Invite code: {inviteCode}
              </div>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-lg w-full text-center text-sm ${
              success 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <Button
            onClick={handleAddFriend}
            disabled={!isValidCode || loading}
            className={`flex items-center justify-center gap-2.5 px-6 py-4 w-full rounded-2xl h-auto font-semibold text-white text-lg transition-all ${
              !isValidCode || loading
                ? 'bg-neutral-200 hover:bg-neutral-200 cursor-not-allowed'
                : 'bg-[#0076ff] hover:bg-[#0066dd]'
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Adding Friend...</span>
              </>
            ) : (
              <span>Add Friend</span>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};
