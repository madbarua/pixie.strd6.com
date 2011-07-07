class UserSessionsController < ApplicationController
  def new
    @top_nav = true
  end

  def create
    @top_nav = true

    if params[:user_session][:login] == "yes"
      # Default to remember me
      @user_session = UserSession.new((params[:user_session] || {}).merge(:remember_me => true))
      @user_session.save do |result|
        if result
          new_user = @user_session.user.login_count == 1

          respond_to do |format|
            format.html do
              save_sprites_to_user(@user_session.user)

              flash[:notice] = "Login successful!"
              redirect_back_or_default root_path
            end
            format.json { render :json => {:status => "ok"} }
          end
        else
          respond_to do |format|
            format.html { render "new" }
            format.json do
              render :json => {
                :status => "error",
                :errors => @user_session.errors.full_messages
              }
            end
          end
        end
      end
    else
      session[:email] = params[:user_session][:email]

      redirect_to new_user_path
    end
  end

  def destroy
    @user_session = UserSession.find
    @user_session.destroy if @user_session

    redirect_to root_url, :notice => "Successfully logged out."
  end
end
